/**
 *
 */
package com.atrioseguros.ws.rs;

import java.io.InputStream;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;

import com.atrioseguros.user.domain.model.User;
import com.atrioseguros.user.domain.model.UserRepository;
import com.atrioseguros.ws.rs.dto.ChangePasswordDTO;
import com.atrioseguros.ws.rs.dto.UserDescriptor;

/**
 * @author dannyds
 *
 */
@Path("/users")
@Stateless
public class UserResource {
	private static final Logger logger = Logger.getLogger(UserResource.class);

	@EJB
	UserRepository userRepository;

	@Resource(name = "java/mail/AtrioMail")
	private Session mailSession;

	@POST
	@Path("login")
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(@FormParam("username") String username, @FormParam("password") String password, @Context HttpServletRequest request) {
		User aUser = null;

		if (request.getUserPrincipal() == null) {
			try {
				request.login(username, password);
				aUser = userRepository.findByUsername(username);
				aUser.setPassword(null);
			} catch (Exception e) {
				throw new WebApplicationException(e.getMessage(), 500);
			}
		}

		return Response.ok().entity(username).build();
	}

	@GET
	@Path("logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout(@Context HttpServletRequest request) {
		try {
			request.logout();
			request.getSession().invalidate();
		} catch (ServletException e) {
			e.printStackTrace();
		}
		return Response.ok().entity("Ok").build();
	}

	@POST
	@Path("/current")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCurrentUser(@Context HttpServletRequest request) {
		UserDescriptor aUserDescriptor = null;

		if (request.getUserPrincipal() != null) {
			User aUser = userRepository.findByUsername(request.getUserPrincipal().getName());

			if (aUser != null) {
				aUserDescriptor = new UserDescriptor(aUser.id(), aUser.username(), aUser.email(), aUser.displayName(), aUser.roles(), aUser.codInter());
			}
		}

		return Response.ok(aUserDescriptor).build();
	}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response register(User aUser) {
		userRepository.add(aUser);
		return Response.ok(aUser).build();
	}

	@POST
	@Path("/change-password")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changePassword(ChangePasswordDTO passwordDTO, @Context HttpServletRequest request) {
		User aUser = null;

		if (request.getUserPrincipal() != null) {
			aUser = userRepository.findByUsername(request.getUserPrincipal().getName());
			if (aUser != null) {
				aUser.changePassword(passwordDTO.oldPassword, passwordDTO.newPassword, passwordDTO.confirmPassword, null);
				userRepository.changePassword(aUser.username(), aUser.password());
			}

		}

		return Response.ok("Ok").build();
	}

	@POST
	@Path("/reset-password")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetPassword(ChangePasswordDTO passwordDTO, @Context HttpServletRequest request) {
		try {
			User aUser = userRepository.findByToken(passwordDTO.token);
			if (aUser != null) {
				aUser.changePassword(passwordDTO.token, passwordDTO.newPassword, passwordDTO.confirmPassword, passwordDTO.token);
				userRepository.changePassword(aUser.username(), aUser.password());
			}
		} catch (Exception e) {
			throw new WebApplicationException(e.getMessage(), 404);
		}

		return Response.ok("Ok").build();
	}

	@POST
	@Path("/send-password")
	@Produces(MediaType.APPLICATION_JSON)
	public Response sendPassword(@FormParam("email") String email) {
		User aUser = userRepository.findByEmail(email);

		if (aUser != null) {
			try {
				logger.debug("Enviando contraseña a " + email);
				// userRepository.changePassword(request.getUserPrincipal().getName(),
				// newPassword);
				String token = userRepository.generateToken(aUser);

				MimeMessage m = new MimeMessage(mailSession);
				Address from = new InternetAddress("comunicamos@atrioseguros.com");
				Address[] to = new InternetAddress[] { new InternetAddress(email) };

				// Now set the actual message
				InputStream stream = this.getClass().getResourceAsStream("/plantillas/_restablecer-clave.html");
				StringBuilder sb = new StringBuilder();
				int content;
				while ((content = stream.read()) != -1) {
					sb.append((char) content);
				}
				stream.close();

				m.setFrom(from);
				m.setRecipients(Message.RecipientType.TO, to);
				m.setSubject("Recuperación de contraseña");
				m.setSentDate(new java.util.Date());
				m.setContent(sb.toString().replace("{{clave}}", token), "text/html;charset=utf-8");
				Transport.send(m);
			} catch (javax.mail.MessagingException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return Response.ok(aUser.toString()).build();
	}
}
