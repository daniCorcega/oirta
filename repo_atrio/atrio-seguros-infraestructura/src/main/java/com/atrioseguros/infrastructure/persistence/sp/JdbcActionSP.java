/**
 * 
 */
package com.atrioseguros.infrastructure.persistence.sp;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import oracle.jdbc.internal.OracleTypes;

import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.SqlInOutParameter;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.StoredProcedure;

import com.atrioseguros.action.domain.model.Action;
import com.atrioseguros.action.domain.model.Parameter;

/**
 * @author dannyds
 * 
 */
public class JdbcActionSP extends StoredProcedure {
	private static final Logger logger = Logger.getLogger(JdbcActionSP.class);

	/**
	 * 
	 * @param ds
	 */
	public JdbcActionSP(Action anAction, DataSource ds) {
		super(ds, anAction.name());
		setFunction(anAction.isFunction());

		logger.debug(anAction.toString());
		for (Parameter param : anAction.parameters()) {
			if (param.isInOutParameter()) { // IN OUT Parameter
				// logger.info("parametro de entrada y salida" + param.name());
				declareParameter(new SqlInOutParameter(param.name(), param.type()));
			} else if (param.isOutParameter()) { // OUT Parameter
				// logger.info("parametro de salida" + param.name());

				// Si el parámetro es del tipo CURSOR, se implementa el método
				// extractData que extrae los valores del cursor
				if (param.type() == OracleTypes.CURSOR) {
					declareParameter(new SqlOutParameter(param.name(), param.type(), new ResultSetExtractor<List<Map<String, Object>>>() {
						@Override
						public List<Map<String, Object>> extractData(ResultSet rs) throws SQLException, DataAccessException {
							List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();

							while (rs.next()) {
								Map<String, Object> row = new HashMap<String, Object>();

								for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
									row.put(rs.getMetaData().getColumnName(i).toLowerCase(), rs.getString(i));
								}

								result.add(row);
							}

							return result;
						}
					}));
				} else {
					declareParameter(new SqlOutParameter(param.name(), param.type()));
				}
			} else { // IN Parameter
				if (param.type() == Types.STRUCT || param.type() == Types.ARRAY) {
					declareParameter(new SqlParameter(param.name(), param.type(), param.typeName()));
				} else {
					declareParameter(new SqlParameter(param.name(), param.type()));
				}
			}
		}

		compile();
	}

}
