/**
 * 
 */
package com.atrioseguros.infrastructure.persistence.sp;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.StoredProcedure;

/**
 * @author dannyds
 *
 */
public class JdbcObtenerCodigoUsuarioSP extends StoredProcedure {
	
	public static final String SP_NAME = "acsel.pr_web_auto.devuelve_usuario ";
	public static final String COD_USUARIO = "cod_usuario";
	public static final String C_TIPOID = "c_tipoid";
	public static final String N_NUMID = "n_numid";
	
	/**
	 * 
	 * @param ds
	 */
	public JdbcObtenerCodigoUsuarioSP(DataSource ds) {		
		super(ds, SP_NAME);
		declareParameter(new SqlOutParameter(COD_USUARIO, Types.VARCHAR));
		declareParameter(new SqlParameter(C_TIPOID, Types.VARCHAR));
		declareParameter(new SqlParameter(N_NUMID, Types.VARCHAR));
		setFunction(true);
		compile();
	}
	
	public Map<String, Object> execute(String tipoId, String numId) {
		Map<String, Object> inputs = new HashMap<String, Object>();
		inputs.put(C_TIPOID, tipoId);
		inputs.put(N_NUMID, numId);	
		return super.execute(inputs);
	}

}
