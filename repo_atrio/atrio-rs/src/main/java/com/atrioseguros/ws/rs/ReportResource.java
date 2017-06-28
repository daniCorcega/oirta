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

import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.sql.DataSource;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.util.JRLoader;

import org.apache.log4j.Logger;

/**
 * @author dannyds
 *
 */
@Path("/reports")
@Stateless
public class ReportResource {
	private static final Logger logger = Logger.getLogger(ReportResource.class);

	@Resource(name = "jdbc/AtrioSegurosDS")
	private DataSource dataSource;

	@Resource(name = "java/mail/AtrioMail")
	private Session mailSession;

	@GET
	@Produces("application/pdf")
	public Response get(@QueryParam("nrosolicitud") Integer nrosolicitud) {
		JasperReport jasperReport = null;
		Connection conn = null;
		InputStream reportStream = null;
		byte[] bytes = null;
		Map<String, Object> inParams = new HashMap<String, Object>();

		inParams.put("NROSOLICITUD", nrosolicitud);

		try {
			conn = dataSource.getConnection();
			reportStream = this.getClass().getResourceAsStream("/cotizacion-vehiculo.jasper");
			jasperReport = (JasperReport) JRLoader.loadObject(reportStream);
			bytes = JasperRunManager.runReportToPdf(jasperReport, inParams, conn);

			reportStream.close();
			conn.close();
		} catch (Exception e) {
			logger.error(e.getStackTrace());
		} finally {
			// Se cierra el stream del archivo del reporte
			try {
				reportStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra la conexión con la base de datos
			try {
				conn.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar conexión con base de datos: " + e, e);
			}
		}

		logger.info("Descargando cotización Nro. " + nrosolicitud.toString());

		ResponseBuilder response = Response.ok((Object) bytes);
		response.header("Content-Disposition", "attachment; filename=cotizacion-vehiculo.pdf");
		response.header("Content-Length", bytes.length);

		return response.build();
	}
      

	@GET
	@Path("/send")
	@Produces(MediaType.APPLICATION_JSON)
	public Response send(@QueryParam("nrosolicitud") Integer nrosolicitud, @DefaultValue("nombre") @QueryParam("email") String email,
			@QueryParam("nombre") String nombre) {
		Map<String, Object> inParams = new HashMap<String, Object>();
		JasperReport jasperReport = null;
		inParams.put("NROSOLICITUD", nrosolicitud);
		InputStream reportStream = null;
		FileOutputStream fileOuputStream = null;
		Connection conn = null;

		try {
			// Create a default MimeMessage object.
			Message message = new MimeMessage(mailSession);

			// Set From: header field of the header.
			message.setFrom(new InternetAddress("comunicamos@atrioseguros.com"));

			// Set To: header field of the header.
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));

			// Set Subject: header field
			message.setSubject("Atrio Seguros - Cotización Automóvil N° " + nrosolicitud);

			// Create the message part
			BodyPart messageBodyPart = new MimeBodyPart();

			// Now set the actual message
			reportStream = this.getClass().getResourceAsStream("/plantillas/_correo-cotizacion.html");
			StringBuilder sb = new StringBuilder();
			int content;
			while ((content = reportStream.read()) != -1) {
				// convert to char and display it
				sb.append((char) content);
			}
			reportStream.close();

			messageBodyPart.setContent(sb.toString().replace("{{nombre}}", nombre), "text/html;charset=utf-8");

			// Create a multipart message
			Multipart multipart = new MimeMultipart();

			// Set text message part
			multipart.addBodyPart(messageBodyPart);

			// Part two is attachment
			messageBodyPart = new MimeBodyPart();

			String filename = "/tmp/cotizacion-" + nrosolicitud + ".pdf";
			conn = dataSource.getConnection();
			reportStream = this.getClass().getResourceAsStream("/cotizacion-vehiculo.jasper");
			jasperReport = (JasperReport) JRLoader.loadObject(reportStream);
			fileOuputStream = new FileOutputStream(filename);
			fileOuputStream.write(JasperRunManager.runReportToPdf(jasperReport, inParams, conn));
			fileOuputStream.close();
			reportStream.close();
			conn.close();

			javax.activation.DataSource source = new FileDataSource(filename);
			messageBodyPart.setDataHandler(new DataHandler(source));
			messageBodyPart.setFileName("/cotizacion-" + nrosolicitud + ".pdf");
			multipart.addBodyPart(messageBodyPart);

			// Send the complete message parts
			message.setContent(multipart);

			// Send messag
			logger.info("Enviando cotización por correo electrónico a " + email);
			Transport.send(message);

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// Se cierra el stream del archivo del reporte
			try {
				reportStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra el stream del archivo del reporte
			try {
				fileOuputStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra la conexión con la base de datos
			try {
				conn.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar conexión con base de datos: " + e, e);
			}
		}

		ResponseBuilder response = Response.ok(this.getClass().getClassLoader().getResource("/cotizacion-vehiculo.jasper").getFile());

		return response.build();
	}

	@GET
	@Path("/{name}/{id}")
	@Produces("application/pdf")
	public Response downloadReport(@PathParam("name") String reportName, @PathParam("id") Integer id) {
		JasperReport jasperReport = null;
		Connection conn = null;
		InputStream reportStream = null;
		byte[] bytes = null;
		Map<String, Object> inParams = new HashMap<String, Object>();

		inParams.put("NROSOLICITUD", id);

		try {
			reportStream = this.getClass().getResourceAsStream("/" + reportName + ".jasper");
			jasperReport = (JasperReport) JRLoader.loadObject(reportStream);
			conn = dataSource.getConnection();
			bytes = JasperRunManager.runReportToPdf(jasperReport, inParams, conn);
		} catch (Exception e) {
			logger.error(e.getStackTrace());
		} finally {
			// Se cierra el stream del archivo del reporte
			try {
				reportStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra la conexión con la base de datos
			try {
				conn.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar conexión con base de datos: " + e, e);
			}
		}

		ResponseBuilder response = Response.ok((Object) bytes);
		response.header("Content-Disposition", "attachment; filename=" + reportName + ".pdf");
		response.header("Content-Length", bytes.length);

		return response.build();
	}
    

	@GET
	@Path("/{name}/{id}/send")
	@Produces("application/pdf")
	public Response sendReport(@PathParam("name") String reportName, @PathParam("id") Integer id, @DefaultValue("nombre") @QueryParam("email") String email,
			@QueryParam("nombre") String nombre) {
		JasperReport jasperReport = null;
		Connection conn = null;
		InputStream reportStream = null;
		Map<String, Object> inParams = new HashMap<String, Object>();
		FileOutputStream fileOuputStream = null;
		String filename = "/tmp/cotizacion-" + id + ".pdf";

		inParams.put("NROSOLICITUD", id);

		try {
			// Create a default MimeMessage object.
			Message message = new MimeMessage(mailSession);

			// Set From: header field of the header.
			message.setFrom(new InternetAddress("comunicamos@atrioseguros.com"));

			// Set To: header field of the header.
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));

			// Set Subject: header field
			message.setSubject("Atrio Seguros - Cotización N° " + id);

			// Create the message part
			BodyPart messageBodyPart = new MimeBodyPart();

			// Now set the actual message
			reportStream = this.getClass().getResourceAsStream("/plantillas/" + reportName + ".html");
			StringBuilder sb = new StringBuilder();
			int content;
			while ((content = reportStream.read()) != -1) {
				// convert to char and display it
				sb.append((char) content);
			}
			reportStream.close();

			messageBodyPart.setContent(sb.toString().replace("{{nombre}}", nombre), "text/html;charset=utf-8");

			// Create a multipart message
			Multipart multipart = new MimeMultipart();

			// Set text message part
			multipart.addBodyPart(messageBodyPart);

			// Part two is attachment
			messageBodyPart = new MimeBodyPart();

			reportStream = this.getClass().getResourceAsStream("/" + reportName + ".jasper");
			jasperReport = (JasperReport) JRLoader.loadObject(reportStream);
			conn = dataSource.getConnection();
			fileOuputStream = new FileOutputStream(filename);
			fileOuputStream.write(JasperRunManager.runReportToPdf(jasperReport, inParams, conn));
			reportStream.close();
			conn.close();

			javax.activation.DataSource source = new FileDataSource(filename);
			messageBodyPart.setDataHandler(new DataHandler(source));
			messageBodyPart.setFileName("/cotizacion-" + id + ".pdf");
			multipart.addBodyPart(messageBodyPart);

			// Send the complete message parts
			message.setContent(multipart);

			// Send messag
			logger.info("Enviando cotización por correo electrónico a " + email);
			Transport.send(message);

		} catch (Exception e) {
			logger.error(e.getStackTrace());
		} finally {
			// Se cierra el stream del archivo del reporte
			try {
				fileOuputStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra el stream del archivo del reporte
			try {
				reportStream.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar archivo de reporte: " + e, e);
			}

			// Se cierra la conexión con la base de datos
			try {
				conn.close();
			} catch (Exception e) {
				logger.error("Error al intentar cerrar conexión con base de datos: " + e, e);
			}
		}

		ResponseBuilder response = Response.ok();

		return response.build();
	}

}
