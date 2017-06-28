/**
 *
 */
package com.atrioseguros.user.domain.model;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.binary.Base64;

/**
 * @author dannyds
 *
 */
public class User {
	private int id;
	private String username;
	private String email;
	private String displayName;
	private String password;
	private List<String> roles = new ArrayList<String>();
	private String codInter;
	//private String estatus; /*Agregado 16/06/16 */

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(int id, String username, String email, String displayName, String password, String codInter ) {
		super();
		this.setId(id);
		this.setUsername(username);
		this.setEmail(email);
		this.setDisplayName(displayName);
		this.setPassword(password);
		this.setCodInter(codInter);
  //  this.setStatus(estatus);
		//this.setStatus(estatus);/*Agregado 16/06/16 */
	}

/*
	public User(int id, String username, String email, String displayName, String password, String codInter, String estatus ) {
		super();
		this.setId(id);
		this.setUsername(username);
		this.setEmail(email);
		this.setDisplayName(displayName);
		this.setPassword(password);
		this.setCodInter(codInter);
    this.setStatus(estatus);
		//this.setStatus(estatus);/*Agregado 16/06/16 */
	//}




	public int id() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String username() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String displayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String email() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String password() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String codInter() {
		return codInter;
	}

	public void setCodInter(String codInter) {
		this.codInter = codInter;
	}

/*
	public String Status() {
		return estatus;
	}

	public void setStatus(String estatus) {
		this.estatus = estatus;
	}

/*
	/**
	 *
	 * @param oldPassword
	 * @param newPassword
	 * @param confirmPassword
	 * @param token
	 * @throws IllegalArgumentException
	 */
	public void changePassword(String oldPassword, String newPassword, String confirmPassword, String token) throws IllegalArgumentException {
		if (oldPassword == null || newPassword == null || confirmPassword == null) {
			throw new IllegalArgumentException("La contraseña no puede ser vacía.");
		}

		if (!newPassword.equals(confirmPassword)) {
			throw new IllegalArgumentException("La nueva contraseña y la confirmación de contraseña no coinciden.");
		}

		if (newPassword.equals(oldPassword)) {
			throw new IllegalArgumentException("La nueva contraseña no puede ser igual a la anterior.");
		}

		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			oldPassword = new String(Base64.encodeBase64(digest.digest(oldPassword.getBytes("UTF-8"))));
			newPassword = new String(Base64.encodeBase64(digest.digest(newPassword.getBytes("UTF-8"))));
			confirmPassword = new String(Base64.encodeBase64(digest.digest(confirmPassword.getBytes("UTF-8"))));

			if (token != null) {
				token = new String(Base64.encodeBase64(digest.digest(token.getBytes("UTF-8"))));
				this.setPassword(token);
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		if (!oldPassword.equals(this.password())) {
			throw new IllegalArgumentException("Contraseña inválida");
		}

		this.setPassword(newPassword);
	}

	public List<String> roles() {
		return roles;
	}

	public void addRole(String role) {
		if (role == null) {
			throw new IllegalArgumentException("El nombre del rol no puede ser nulo.");
		}

		this.roles.add(role.toUpperCase());
	}

	public boolean isUserInRole(String role) {
		boolean isUserInRol = false;

		if (role != null) {
			isUserInRol = this.roles.contains(role.toUpperCase());
		}

		return isUserInRol;
	}

}
