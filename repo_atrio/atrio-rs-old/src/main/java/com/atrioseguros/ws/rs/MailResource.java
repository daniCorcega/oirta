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

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

/**
 * @author dannyds
 *
 */
@Path("/mail")
@Stateless
public class MailResource {
	// private static final Logger logger =
	// LogManager.getLogger("ReportResource");

	@Resource(name = "java/mail/AtrioMail")
	private Session mailSession;
	@POST
	@Path("/send")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response post() {
		try {
			MimeMessage m = new MimeMessage(mailSession);
			Address from = new InternetAddress("comunicamos@atrioseguros.com");
			Address[] to = new InternetAddress[] { new InternetAddress("wrodriguez@atrioseguros.com") };

			m.setFrom(from);
			m.setRecipients(Message.RecipientType.TO, to);
			m.setSubject("JBoss Mail");
			m.setSentDate(new java.util.Date());
			m.setContent("Mail sent from JBoss", "text/plain");
			Transport.send(m);
		} catch (javax.mail.MessagingException e) {
			e.printStackTrace();
		}

		ResponseBuilder response = Response.ok();
		return response.build();
	}

}
