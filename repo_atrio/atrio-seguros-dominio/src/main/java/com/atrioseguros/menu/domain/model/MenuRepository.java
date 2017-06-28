package com.atrioseguros.menu.domain.model;

public interface MenuRepository {
	public Menu findByRole(String role, int userId);
}
