package com.atrioseguros.menu.domain.model;

import static org.junit.Assert.*;

import org.junit.Test;

public class MenuTest {

	@Test
	public void testAddChild() {
		Menu menu = new Menu();
		
		MenuItem menuItem1 = new MenuItem(1, "Inicio", "inicio", "icon", null, true);
		MenuItem menuItem2 = new MenuItem(2, "Cotizaciones", "Cotizaciones", "icon", null, true);
		MenuItem menuItem3 = new MenuItem(3, "Emisiones", "Emisiones", "icon", null, true);		
		
		menu.addChild(0, menuItem1);
		assertTrue(menu.root().containsKey(1));		
		menu.addChild(1, menuItem2);
		assertTrue(menu.root().containsKey(2));
		menu.addChild(1, menuItem3);
		assertTrue(menu.root().containsKey(3));
	}

}
