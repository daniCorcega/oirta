package com.atrioseguros.infrastructure.persistence;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;

import com.atrioseguros.action.domain.model.Action;
import com.atrioseguros.action.domain.model.ActionId;
import com.atrioseguros.action.domain.model.ActionRepository;
import com.atrioseguros.action.domain.model.Parameter;
import com.atrioseguros.action.domain.model.RequestMethod;

@Stateless
public class JdbcActionRepository implements ActionRepository {

	@Resource(name = "jdbc/AtrioSegurosDS")
	private DataSource dataSource;

	private JdbcTemplate jdbcTemplate;

	public Action findActionByModule(String module, String uri, RequestMethod requestMethod) {
		StringBuilder sql = new StringBuilder();
		this.jdbcTemplate = new JdbcTemplate(this.dataSource);

		sql.append("SELECT a.id,");
		sql.append("       a.name action_name,");
		sql.append("       a.module,");
		sql.append("       a.uri,");
		sql.append("       a.is_function,");
		sql.append("       a.request_method,");
		sql.append("       p.name param_name,");
		sql.append("       p.type_id,");
		sql.append("       p.in_parameter,");
		sql.append("       p.out_parameter,");
		sql.append("       p.type_name param_type_name,");
		sql.append("       p.user_id user_id,");
		sql.append("       pt.name param_type");
		sql.append("  FROM actions a, action_parameters p, parameter_types pt");
		sql.append(" WHERE LOWER(a.module) = LOWER(?)");
		sql.append("   AND LOWER(a.uri) = LOWER(?)");
		sql.append("   AND LOWER(a.request_method) = LOWER(?)");
		sql.append("   AND a.id = p.action_id");
		sql.append("   AND p.type_id = pt.id");
		sql.append(" ORDER BY p.p_order ASC");

		return this.jdbcTemplate.query(sql.toString(), new ResultSetExtractor<Action>() {
			@Override
			public Action extractData(ResultSet rs) throws SQLException, DataAccessException {
				Action action = null;
				while (rs.next()) {
					if (action == null) {
						action = new Action(
								new ActionId(rs.getInt("id")), 
								rs.getString("action_name"), 
								rs.getString("module"), 
								rs.getString("uri"), 
								rs.getBoolean("is_function"), 
								null,
								RequestMethod.valueOf(rs.getString("request_method").toUpperCase()));
					}

					Parameter aParameter = new Parameter(
							rs.getString("param_name"), 
							rs.getInt("type_id"), 
							rs.getBoolean("in_parameter"), 
							rs.getBoolean("out_parameter"),
							rs.getString("param_type_name"),
							rs.getInt("user_id"));

					action.addParameter(aParameter);
				}

				return action;
			}
		}, module, uri, requestMethod.name());
	}
}
