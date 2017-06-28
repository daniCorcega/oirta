/*
 * DataResource.java dannyds
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
package com.atrioseguros.ws.rs;

import java.util.Map;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.SecurityContext;

import org.apache.log4j.Logger;

import com.atrioseguros.action.domain.model.ActionService;
import com.atrioseguros.action.domain.model.RequestMethod;

/**
 * @author dannyds
 * 
 */
@Path("/data")
@Stateless
public class DataResource {
	private static final Logger logger = Logger.getLogger(DataResource.class);

	@EJB
	ActionService actionService;

	@GET
	@Path("/{module}/{uri}")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> get(@PathParam("module") String module, @PathParam("uri") String uri, @Context SecurityContext context) {
		logger.debug("GET: " + module + "/" + uri);
		return actionService.execute(module, uri, RequestMethod.GET, null, context.getUserPrincipal().getName());
	}

	@POST
	@Path("/{module}/{uri}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> post(@PathParam("module") String module, @PathParam("uri") String uri, Map<String, Object> inParams,
			@Context SecurityContext context) {
		logger.debug("POST: " + module + "/" + uri);
		return actionService.execute(module, uri, RequestMethod.POST, inParams, context.getUserPrincipal().getName());
	}
}
