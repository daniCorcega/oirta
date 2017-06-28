package com.atrioseguros.infrastructure.persistence;

import java.security.MessageDigest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.sql.DataSource;

import org.apache.commons.codec.binary.Base64;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import com.atrioseguros.infrastructure.persistence.sp.JdbcCrearUsuarioSP;
import com.atrioseguros.infrastructure.persistence.sp.JdbcObtenerCodigoIntermediarioSP;
import com.atrioseguros.infrastructure.persistence.sp.JdbcObtenerCodigoUsuarioSP;
import com.atrioseguros.user.domain.model.User;
import com.atrioseguros.user.domain.model.UserRepository;

@Stateless
public class JdbcUserRepository implements UserRepository {
	// private static final Logger logger =
	// LogManager.getLogger("SpringUserRepository");

	private JdbcTemplate jdbcTemplate;

	@Resource(name = "jdbc/AtrioSegurosDS")
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}

	@Override
	public void add(User aUser) {
		try {
			JdbcCrearUsuarioSP sp = new JdbcCrearUsuarioSP(this.jdbcTemplate.getDataSource());
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest("password".getBytes("UTF-8"));
			sp.execute(aUser.username(), new String(Base64.encodeBase64(hash)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void remove(User aUser) {
		// TODO Auto-generated method stub

	}

	@Override
	public User findByUsername(String username) {
		StringBuilder sql = new StringBuilder();

		// Query para consulta de usuario

		sql.append("SELECT u.*,");
		sql.append("       r.nombre rol,");
		sql.append("       acsel.pr_web_auto.devuelve_codinter(substr(u.username, 1, 1),");
		sql.append("                                           to_number(substr(u.username, 2))) codinter");
		sql.append("  FROM usuarios u");
		sql.append(" INNER JOIN usuario_roles ur ON u.ID = ur.id_usuario");
		sql.append(" INNER JOIN ROLES r ON ur.Id_Rol = r.ID");
		sql.append(" WHERE username = ?");
		sql.append("   AND ur.status LIKE 'ACT'");
		sql.append("   AND (r.id_rol_padre IS NULL OR");
		sql.append("        r.id_rol_padre IN (SELECT r2.ID");
		sql.append("                             FROM ROLES r2");
		sql.append("                            INNER JOIN usuario_roles ur2 ON r2.ID = ur2.Id_Rol");
		sql.append("                            WHERE ur2.id_usuario = u.ID");
		sql.append("                              AND ur2.status LIKE 'ACT'))");

	 /* 15/6/2016 ajuste*/
/*
		 sql.append(" select u.*,");
		// sql.append(" Empleado' rol");
		 sql.append("												 acsel.pr_web_auto.devuelve_codinter(substr(u.username, 1, 1), ");
		 sql.append("                 to_number(substr(u.username, 2))) codinter ");
		 sql.append(" from usuarios u");
		 sql.append(" where USERNAME = ?  ");
	/*  fin */


		return this.jdbcTemplate.query(sql.toString(), new ResultSetExtractor<User>() {
			@Override
			public User extractData(ResultSet rs) throws SQLException, DataAccessException {
				User user = null;
				while (rs.next()) {
					if (user == null) {
						user = new User(rs.getInt("id"), rs.getString("username"), rs.getString("email"),rs.getString("display_name"), rs
								.getString("password"), rs.getString("codinter"));
					}

					user.addRole(rs.getString("rol"));
				}

				return user;
			}
		}, username);

	}

	@Override
	public User findByEmail(String email) {
		User user = this.jdbcTemplate.queryForObject("SELECT * FROM usuarios WHERE email = ?", new Object[] { email }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				User user = new User(rs.getInt("id"), rs.getString("username"), rs.getString("email"), rs.getString("display_name"), rs.getString("password"), null);
				return user;
			};
		});

		return user;
	}

	@Override
	public User findByToken(String token) {
		User user = this.jdbcTemplate.queryForObject(
				"SELECT u.* FROM usuarios u INNER JOIN usuario_tokens ut ON u.ID = ut.usuario_id WHERE ut.status = 1 AND ut.token = ?", new Object[] { token },
				new RowMapper<User>() {
					public User mapRow(ResultSet rs, int rowNum) throws SQLException {
						User user = new User(rs.getInt("id"), rs.getString("username"), rs.getString("email"), rs.getString("display_name"), rs
								.getString("password"), null);
						return user;
					};
				});

		return user;
	}

	@Override
	public String getCodigoUsuario(String username) {
		Map<String, Object> result = null;
		String codigoUsuario = null;

		try {
			JdbcObtenerCodigoUsuarioSP sp = new JdbcObtenerCodigoUsuarioSP(this.jdbcTemplate.getDataSource());
			result = sp.execute(username.charAt(0), username.substring(1));
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (result != null) {
			codigoUsuario = (String) result.get(JdbcObtenerCodigoUsuarioSP.COD_USUARIO);
		}

		return codigoUsuario;
	}

	@Override
	public String getCodigoIntermediario(String username) {
		Map<String, Object> result = null;
		String codigoIntermediario = null;

		try {
			JdbcObtenerCodigoIntermediarioSP sp = new JdbcObtenerCodigoIntermediarioSP(this.jdbcTemplate.getDataSource());
			result = sp.execute(username.charAt(0), username.substring(1));
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (result != null) {
			codigoIntermediario = (String) result.get(JdbcObtenerCodigoIntermediarioSP.COD_INTERMEDIARIO);
		}

		return codigoIntermediario;
	}




	@Override
	public void changePassword(String username, String newPassword) {
		// Se actualiza la contraseña del usuario
		this.jdbcTemplate.update("UPDATE usuarios SET password = ? WHERE username = ?", newPassword, username);

		// Si hay tokens activos de recuperar contraseña, se inactivan
		this.jdbcTemplate.update("UPDATE usuario_tokens SET status = 0 WHERE usuario_id = (SELECT id FROM usuarios WHERE username = ?)", username);
	}

	@Override
	public String generateToken(User aUser) {
		String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		Random rnd = new Random();
		int len = 8;
		StringBuilder token = new StringBuilder(len);

		for (int i = 0; i < len; i++) {
			token.append(AB.charAt(rnd.nextInt(AB.length())));
		}

		this.jdbcTemplate.update("insert into usuario_tokens (token, usuario_id) values (?, ?)", token.toString(), aUser.id());

		return token.toString();
	}

	@Override
	public void updateLastLoginDate(String username) {
		this.jdbcTemplate.update("UPDATE usuarios SET fecha_ultima_sesion = SYSDATE WHERE username = ?", username);
	}

}
