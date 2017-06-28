package com.atrioseguros.menu.domain.model;

import java.util.LinkedHashMap;
import java.util.Map;

public class Menu {
	private String name;
	private Map<Integer, MenuItem> root = new  LinkedHashMap<Integer, MenuItem>();
	
	public Map<Integer, MenuItem> root() {
		return this.root;
	}
	
	public void addChild(int parentId, MenuItem item) {
		MenuItem parent = root.get(new Integer(parentId));
		
		if (parent == null || parentId == 1) {
			root.put(new Integer(item.id()), item);
		} else {
			parent.addChild(item);
		}
	}
	
}
