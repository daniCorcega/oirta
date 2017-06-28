package com.atrioseguros.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ReportServlet
 */
@WebServlet("/reports/rwservlet")
public class ReportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private int BUFFER_LENGTH = 4096;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ReportServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		URL website = new URL("http://192.168.7.17/cgi-bin/rwcgi60.exe?".concat(request.getQueryString()));
		InputStream is = website.openStream();
		ServletOutputStream os = response.getOutputStream();

		try {
			// Se configura el tipo de archivo que se va a enviar
			response.setContentType("application/pdf");

			// Encabezado para activar el cuadro de diálogo para descargar el archivo.
			response.setHeader("Content-disposition", "attachment; filename=yourcustomfilename.pdf");

			// Se envia el archivo al navegador
			byte[] buffer = new byte[BUFFER_LENGTH];
			int length;
			while ((length = is.read(buffer)) > 0) {
				os.write(buffer, 0, length);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.flush();
			} catch (Exception e2) {
				e2.printStackTrace();
			}

			try {
				is.close();
			} catch (Exception e2) {
				e2.printStackTrace();
			}

			try {
				os.close();
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
	}

}
