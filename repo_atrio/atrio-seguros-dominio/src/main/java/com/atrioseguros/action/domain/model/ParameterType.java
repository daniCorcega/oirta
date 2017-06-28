package com.atrioseguros.action.domain.model;

public enum ParameterType {
	CHAR(1), NUMERIC(2), DECIMAL(3), VARCHAR(12);

	private final int id;

	private ParameterType(int id) {
		this.id = id;
	}

	public int id() {
		return id;
	}

}
