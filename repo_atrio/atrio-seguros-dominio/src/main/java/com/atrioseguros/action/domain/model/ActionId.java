
package com.atrioseguros.action.domain.model;

/**
 * @author dannyds
 *
 */
public class ActionId {
	private int id;
	
	public ActionId(int id) {
		super();
		this.setId(id);
	}

	private void setId(int id) {
		if (id == 0) {
			throw new IllegalArgumentException("El id deber ser mayor que 0");
		}
		this.id = id;		
	}

	public int id() {
		return this.id;
	}

	@Override
	public String toString() {
		return "ActionId [id=" + id + "]";
	}
	
}
