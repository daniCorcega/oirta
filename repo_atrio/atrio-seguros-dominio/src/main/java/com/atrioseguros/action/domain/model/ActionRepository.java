package com.atrioseguros.action.domain.model;

public interface ActionRepository {
	public Action findActionByModule(String module, String uri, RequestMethod method);
}
