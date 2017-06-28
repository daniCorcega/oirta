package com.atrioseguros.action.domain.model;

import java.util.ArrayList;
import java.util.List;

public class Action {
	private ActionId actionId;
	private String name;
	private boolean function;
	private List<Parameter> parameters;
	private String module;
	private String uri;
	private RequestMethod requestMethod;

	/**
	 * 
	 * @param actionId
	 * @param name
	 * @param module
	 * @param uri
	 * @param function
	 * @param parameters
	 */
	public Action(ActionId actionId, String name, String module, String uri, boolean function, List<Parameter> parameters, RequestMethod requestMethod) {
		super();
		this.setActionId(actionId);
		this.setModule(module);
		this.setName(name);
		this.setFunction(function);
		this.setUri(uri);
		this.setParameters(parameters);
		this.setRequestMethod(requestMethod);
	}

	public ActionId actionId() {
		return this.actionId;
	}

	public String name() {
		return this.name;
	}

	public boolean isFunction() {
		return this.function;
	}

	public List<Parameter> parameters() {
		return this.parameters;
	}

	public String module() {
		return this.module;
	}

	public String uri() {
		return this.uri;
	}

	public RequestMethod requestMethod() {
		return this.requestMethod;
	}

	public void setActionId(ActionId anActionId) {
		this.actionId = anActionId;
	}

	public void setName(String aName) {
		if (aName == null) {
			throw new IllegalArgumentException("El nombre no puede ser nulo");
		}

		this.name = aName.toLowerCase();
	}

	public void setFunction(boolean aFunction) {
		this.function = aFunction;
	}

	public void setParameters(List<Parameter> aParameters) {
		this.parameters = aParameters;
	}

	public void addParameter(Parameter aParameter) {
		if (this.parameters() == null) {
			this.setParameters(new ArrayList<Parameter>());
		}

		this.parameters().add(aParameter);
	}

	public void setModule(String aModule) {
		this.module = aModule;
	}

	private void setUri(String uri) {
		this.uri = uri;
	}

	private void setRequestMethod(RequestMethod requestMethod) {
		this.requestMethod = requestMethod;
	}

	@Override
	public String toString() {
		return "Action [actionId=" + actionId + ", name=" + name + ", function=" + function + ", parameters=" + parameters + ", module=" + module + ", uri="
				+ uri + ", requestMethod=" + requestMethod + "]";
	}

}
