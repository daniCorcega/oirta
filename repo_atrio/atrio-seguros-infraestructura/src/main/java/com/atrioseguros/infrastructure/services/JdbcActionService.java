/*
 * SpringActionService.java dannyds
 *
 * Copyright (c) 2014 CLETECI, C.A. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * CLETECI, C.A. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with CLETECI.
 *
 * CLETECI MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. SUN SHALL NOT BE LIABLE FOR
 * ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
 * DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */
package com.atrioseguros.infrastructure.services;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Struct;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.SqlTypeValue;
import org.springframework.jdbc.core.support.AbstractSqlTypeValue;

import com.atrioseguros.action.domain.model.Action;
import com.atrioseguros.action.domain.model.ActionRepository;
import com.atrioseguros.action.domain.model.ActionService;
import com.atrioseguros.action.domain.model.Parameter;
import com.atrioseguros.action.domain.model.RequestMethod;
import com.atrioseguros.infrastructure.persistence.sp.JdbcActionSP;
import com.atrioseguros.user.domain.model.UserRepository;

/**
 * @author dannyds
 *
 */
@Stateless
public class JdbcActionService implements ActionService {
	private static final Logger logger = Logger.getLogger(JdbcActionService.class);

	@EJB
	ActionRepository actionRepository;

	@EJB
	UserRepository userRepository;

	@Resource(name = "jdbc/AtrioSegurosDS")
	private DataSource dataSource;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.atrioseguros.action.domain.model.ActionService#execute(com.atrioseguros
	 * .action.domain.model.Action, java.util.Map
	 */
	@Override
	public Map<String, Object> execute(String module, String uri, RequestMethod requestMethod, Map<String, Object> params, String username)
			throws IllegalArgumentException {
		Map<String, Object> result = null;
		Map<String, Object> inParams = new HashMap<String, Object>();

		Action anAction = actionRepository.findActionByModule(module, uri, requestMethod);
		if (anAction == null) {
			throw new IllegalArgumentException("El URL que se está llamando no existe.");
		} else {
			JdbcActionSP anStoredProcedure = new JdbcActionSP(anAction, dataSource);

			for (Parameter aParam : anAction.parameters()) {
				if (params == null) {
					inParams.put(aParam.name(), null);
				} else {
					if (aParam.userId() == 1) { // Si userId es 1, se envia el código de usuario en Acsel
						inParams.put(aParam.name(), this.getCodigoUsuario(username));
					} else if (aParam.userId() == 2) { // Si userId es 2, se envia el nombre de usuario logueado
						inParams.put(aParam.name(), username);
					} else if (aParam.userId() == 3) { // Si userId es 3, se devuelve el código de intermediario en Acsel
						inParams.put(aParam.name(), this.getCodigoIntermediario(username));
					} else {
						switch (aParam.type()) {
						case Types.VARCHAR:
							inParams.put(aParam.name(), (String) params.get(aParam.name()));
							break;
						case Types.DATE:
							Date date = null;

							try {
								date = new SimpleDateFormat("dd/MM/yyyy").parse((String) params.get(aParam.name()));
							} catch (Exception e) {
								// logger.error(e);
							}
							// logger.debug(date);
							inParams.put(aParam.name(), date);
							break;
						case Types.STRUCT:
							Map<String, Object> record = (Map<String, Object>) params.get(aParam.name());
							final Object[] attributes = new Object[record.size()];

							// Se extraen los elementos del mapa para convertirlo en un arreglo de objetos que
							// será utilizado para mapear el tipo de dato STRUCT en la base de datos
							int i = 0;
							for (Object object : record.values()) {
								attributes[i++] = object;
							}

							SqlTypeValue structValue = new AbstractSqlTypeValue() {
								protected Object createTypeValue(Connection conn, int sqlType, String typeName) throws SQLException {
									Struct item = conn.createStruct(typeName, attributes);
									return item;
								}
							};

							inParams.put(aParam.name(), structValue);
							break;
						default:
							inParams.put(aParam.name(), params.get(aParam.name()));
							break;
						}
					}
				}
			}

			logger.debug(String.format("Usuario [%s] ejecutando en el módulo [%s] la acción [%s] con [%s]", username, module, uri, requestMethod));
			logger.debug(String.format("Parámetros: [%s]", inParams.toString()));
			result = anStoredProcedure.execute(inParams);
		}

		return result;
	}

	private String getCodigoUsuario(String username) {
		return userRepository.getCodigoUsuario(username);
	}
	
	private String getCodigoIntermediario(String username) {
		return userRepository.getCodigoIntermediario(username);
	}

	
}
