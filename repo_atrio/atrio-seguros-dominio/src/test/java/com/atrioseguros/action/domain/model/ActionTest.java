package com.atrioseguros.action.domain.model;

import static org.junit.Assert.*;

import org.junit.Test;

public class ActionTest {

	@Test
	public void testAction() {		
		Action action = new Action(new ActionId(1), "Prueba", "Modulo", "Uri", false, null, RequestMethod.GET);
		action.addParameter(new Parameter("param1", 1, true, false, "REC", 1));
		action.addParameter(new Parameter("param2", 2, true, false, "REC", 0));
		action.addParameter(new Parameter("param3", 3, false, true, "REC", 2));
		
		assertEquals("Modulo", action.module());
		assertNotNull(action.parameters());
		assertEquals(3, action.parameters().size());
		assertEquals(RequestMethod.GET, action.requestMethod());
	}

}
