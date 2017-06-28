/**
 *
 */
package com.atrioseguros.ws.rs.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * @author dannyds
 *
 */
public class UserDescriptor {
	private int id;
	private String username;
	private String email;
	private String displayName;
	private List<String> roles = new ArrayList<String>();
	private String codInter;

	public UserDescriptor() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserDescriptor(int id, String username, String email, String displayName, List<String> roles, String codInter) {
		super();
		this.setId(id);
		this.setUsername(username);
		this.setEmail(email);
		this.setDisplayName(displayName);
		this.setRoles(roles);
		this.codInter = codInter;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public String getCodInter() {
		return codInter;
	}

	public void setCodInter(String codInter) {
		this.codInter = codInter;
	}

}
