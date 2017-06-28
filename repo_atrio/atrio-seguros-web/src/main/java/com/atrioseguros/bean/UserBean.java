package com.atrioseguros.bean;

import java.io.Serializable;

import javax.ejb.EJB;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import com.atrioseguros.menu.domain.model.Menu;
import com.atrioseguros.menu.domain.model.MenuItem;
import com.atrioseguros.menu.domain.model.MenuRepository;
import com.atrioseguros.user.domain.model.User;
import com.atrioseguros.user.domain.model.UserRepository;

@ManagedBean(name = "userBean")
@SessionScoped
public class UserBean implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 2170006002316082379L;
	private String numId;
	private String tipoId;
	private String password;
	private String displayName;
	private String email;
	private String role;
	private Menu menu;

	@EJB
	UserRepository userRepository;

	@EJB
	MenuRepository menuRepository;

	public String getNumId() {
		return numId;
	}

	public void setNumId(String numId) {
		this.numId = numId;
	}

	public String getTipoId() {
		return tipoId;
	}

	public void setTipoId(String tipoId) {
		this.tipoId = tipoId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

  public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	/**
	 * Obtiene el menu según el rol del usuario logueado
	 *
	 * @return <code>String</code>
	 */
	public String getMenu() {
		StringBuffer htmlMenu = new StringBuffer();
		if (menu != null && menu.root() != null) {
			for (MenuItem item : menu.root().values()) {
				if (item.hasChildren() && item.isActive()) {
					htmlMenu.append("<li class=\"nav-parent\"><a> <i class=\"");
					htmlMenu.append(item.icon());
					htmlMenu.append("\" aria-hidden=\"true\"></i> <span>");
					htmlMenu.append(item.displayName());
					htmlMenu.append("</span></a>");
					htmlMenu.append("<ul class=\"nav nav-children\">");
					for (MenuItem subItem : item.children().values()) {
						htmlMenu.append("<li><a href=\"");
						htmlMenu.append(subItem.url());
						htmlMenu.append("\"> ");
						htmlMenu.append(subItem.displayName());
						htmlMenu.append("</a></li>");
					}
					htmlMenu.append("</ul></li>");
				} else {
					htmlMenu.append("<li><a href=\"");
					htmlMenu.append(item.url());
					htmlMenu.append("\"> <i class=\"");
					htmlMenu.append(item.icon());
					htmlMenu.append("\" aria-hidden=\"true\"></i> <span>");
					htmlMenu.append(item.displayName());
					htmlMenu.append("</span></a></li>");
				}
			}
		}

		return htmlMenu.toString();
	}

	public String login() {
		User aUser = null;
		String username = null;
		HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
		String url = null;
		//String estatus;
		//String men = "000000000*";
       // men = men.concat("00*");
		if (request.getUserPrincipal() == null) {
			try {
				username = this.tipoId.concat(this.numId);
				aUser = userRepository.findByUsername(username);
				//men = men.concat("1");
				//estatus = "ACT";
        //aSta = userRepository.findBystatus(status);
				if (aUser == null) {
					//men = men.concat("2*");
					FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "Usuario o contraseña inválidos", null));
				} else if (!aUser.isUserInRole(this.role)) {
					//men =men.concat("3*");
					FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, " Su Usuario no puede ingresar con el rol seleccionado", null));
				//} else if (aUser.Status().compareTo(estatus)!= 0) {
					//FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "El usuario se encuentra bloqueado", null));
				} else {
					//men = men.concat("4*");
					request.login(username, this.password);
					//men = men.concat("5*");
					this.setDisplayName(aUser.displayName());
					//men = men.concat("6*");
					userRepository.updateLastLoginDate(username);
					//men = men.concat("7*");
					this.menu = menuRepository.findByRole(this.role, aUser.id());
					url = "/index.xhtml?faces-redirect=true";
				}
			} catch (Exception se) {
				FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "Usuario o contraseña inválidos", null));
				se.printStackTrace();
			}
		} else {
			url = "/index.xhtml?faces-redirect=true";
		}

		return url;
	}

	public String logout() {
		HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();

		try {
			request.logout();
			request.getSession().invalidate();
		} catch (ServletException e) {
			e.printStackTrace();
		}

		return "/login.xhtml?faces-redirect=true";
	}

}
