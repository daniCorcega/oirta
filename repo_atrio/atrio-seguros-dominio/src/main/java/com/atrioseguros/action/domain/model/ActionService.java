package com.atrioseguros.action.domain.model;

import java.util.Map;

public interface ActionService {
	public Map<String, Object> execute(String module, String uri, RequestMethod requestMethod, Map<String, Object> inParams, String username)
			throws IllegalArgumentException;
}
