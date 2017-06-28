package com.atrioseguros.infrastructure.persistence;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;

import com.atrioseguros.menu.domain.model.Menu;
import com.atrioseguros.menu.domain.model.MenuItem;
import com.atrioseguros.menu.domain.model.MenuRepository;

@Stateless
public class JdbcMenuRepository implements MenuRepository {
	// private static final Logger logger =
	// LogManager.getLogger("SpringUserRepository");

	private JdbcTemplate jdbcTemplate;

	@Resource(name = "jdbc/AtrioSegurosDS")
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}
@Override
	public Menu findByRole(String role, int userId) {
		StringBuilder sql = new StringBuilder();

		// Query para consulta de menu según roles
		sql.append("SELECT mi.*, rmi.active");
		sql.append("  FROM menu_items mi");
		sql.append(" INNER JOIN rol_menu_items rmi ON mi.ID = rmi.menu_item_id AND mi.ID_MENU='1'");
		sql.append(" WHERE rmi.active = 1 AND rmi.rol_id IN");
		sql.append(" (SELECT r2.ID");
		sql.append("    FROM ROLES r2");
		sql.append("   INNER JOIN usuario_roles ur2 ON r2.ID = ur2.id_rol");
		sql.append("   WHERE ur2.id_usuario = ? AND UR2.Status LIKE 'ACT' AND (r2.nombre LIKE ? OR r2.id_rol_padre IN");
		sql.append(" (SELECT r3.ID");
		sql.append("    FROM ROLES r3");
		sql.append("   INNER JOIN usuario_roles ur3 ON r3.ID = ur3.Id_Rol");
		sql.append("   WHERE r3.nombre LIKE ? AND ur3.Id_Usuario = ? AND ur3.status LIKE 'ACT')))");
		sql.append(" ORDER BY mi.lft");

		return this.jdbcTemplate.query(sql.toString(), new ResultSetExtractor<Menu>() {
			@Override
			public Menu extractData(ResultSet rs) throws SQLException, DataAccessException {
				Menu menu = new Menu();
				while (rs.next()) {
					MenuItem menuItem = new MenuItem(rs.getInt("id"), rs.getString("nombre"), rs.getString("nombre"), rs.getString("icon"),
							rs.getString("url"), rs.getBoolean("active"));
					menu.addChild(rs.getInt("id_padre"), menuItem);
				}

				return menu;
			}
		}, userId, role, role, userId);

	}

}
/*
	@Override
	public Menu findByRole(String role, int userId) {
		StringBuilder sql = new StringBuilder();

		// Query para consulta de menu según roles
	sql.append("SELECT mi.*, rmi.active");
	sql.append("FROM menu_items mi");
    sql.append("INNER JOIN rol_menu_items rmi ON mi.ID = rmi.menu_item_id AND mi.ID_MENU='1'");
	sql.append("WHERE rmi.active = 1 AND rmi.rol_id IN");
    sql.append("(SELECT ur2.ID_ROL");
    sql.append("FROM usuario_roles ur2, ROLES r2");
    sql.append("WHERE ur2.id_usuario = ? AND ur2.status LIKE 'ACT' AND ur2.ID_ROL=r2.id OR r2.id_rol_padre IN");
    sql.append("(SELECT r3.ID_ROL_PADRE");
    sql.append("FROM ROLES r3");
    sql.append("WHERE r3.ID = r2.id))");                    
    sql.append("ORDER BY mi.lft");

		return this.jdbcTemplate.query(sql.toString(), new ResultSetExtractor<Menu>() {
			@Override
			public Menu extractData(ResultSet rs) throws SQLException, DataAccessException {
				Menu menu = new Menu();
				while (rs.next()) {
					MenuItem menuItem = new MenuItem(rs.getInt("id"), rs.getString("nombre"), rs.getString("nombre"), rs.getString("icon"),
							rs.getString("url"), rs.getBoolean("active"));
					menu.addChild(rs.getInt("id_padre"), menuItem);
				}

				return menu;
			}
		}, userId, role, role, userId);

	}

}
*/

