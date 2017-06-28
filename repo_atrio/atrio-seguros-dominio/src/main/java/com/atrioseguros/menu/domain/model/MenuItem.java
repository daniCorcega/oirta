package com.atrioseguros.menu.domain.model;

import java.util.LinkedHashMap;
import java.util.Map;

public class MenuItem {
	private int id;
	private String name;
	private String displayName;
	private String url;
	private String icon;
	private boolean active;
	private MenuItem parent;
	private Map<Integer, MenuItem> children = new LinkedHashMap<Integer, MenuItem>();

	public MenuItem(int id, String name, String displayName, String icon, String url, boolean active) {
		super();
		this.id = id;
		this.name = name;
		this.displayName = displayName;
		this.icon = icon;
		this.url = url;
		this.setActive(active);
	}

	public int id() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String name() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String displayName() {
		return this.displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String url() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
	public String icon() {
		return this.icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	public boolean isActive() {
		return this.active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public MenuItem parent() {
		return this.parent;
	}

	public void setParent(MenuItem parent) {
		this.parent = parent;
	}

	public Map<Integer, MenuItem> children() {
		return this.children;
	}

	public void addChild(MenuItem item) {
		if (item == null) {
			throw new IllegalArgumentException("El nodo no puede ser nulo.");
		}

		item.setParent(this);
		this.children.put(new Integer(item.id), item);
	}
	
	public boolean hasChildren() {
		return (this.children.size() > 0);
	}
}
