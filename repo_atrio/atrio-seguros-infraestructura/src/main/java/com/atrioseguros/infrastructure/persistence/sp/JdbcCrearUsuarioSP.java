/**
 * 
 */
package com.atrioseguros.infrastructure.persistence.sp;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.StoredProcedure;

/**
 * @author dannyds
 *
 */
public class JdbcCrearUsuarioSP extends StoredProcedure {
	
	private static final String SP_NAME = "usuarios_api.crear_usuario";
	private static final String I_USERNAME = "i_username";
	private static final String I_PASSWORD = "i_password";
	
	/**
	 * 
	 * @param ds
	 */
	public JdbcCrearUsuarioSP(DataSource ds) {		
		super(ds, SP_NAME);
		declareParameter(new SqlParameter(I_USERNAME, Types.VARCHAR));
		declareParameter(new SqlParameter(I_PASSWORD, Types.VARCHAR));
		compile();
	}
	
	public Map<String, Object> execute(String username, String password) {
		Map<String, Object> inputs = new HashMap<String, Object>();
		inputs.put(I_USERNAME, username);
		inputs.put(I_PASSWORD, password);	
		return super.execute(inputs);
	}

}
