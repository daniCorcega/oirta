package com.atrioseguros.action.domain.model;

public class Parameter {
	private String name;
	private int type;
	private boolean in;
	private boolean out;
	private String typeName;
	private int userId;

	public Parameter(String name, int type, boolean in, boolean out, String typeName, int userId) {
		super();
		this.setName(name);
		this.setType(type);
		this.setInParameter(in);
		this.setOutParameter(out);
		this.setTypeName(typeName);
		this.setUserId(userId);
	}

	public String name() {
		return this.name;
	}

	public int type() {
		return this.type;
	}

	public boolean isInParameter() {
		return this.in;
	}

	public boolean isOutParameter() {
		return this.out;
	}
	
	public boolean isInOutParameter() {
		return this.in && this.out;
	}
	
	public String typeName() {
		return this.typeName;
	}
	
	public int userId() {
		return this.userId;
	}
	
	private void setName(String aName) {
		if (aName != null) {
			this.name = aName.toLowerCase();
		}		
	}

	private void setInParameter(boolean in) {
		this.in = in;
	}

	private void setOutParameter(boolean out) {
		this.out = out;
	}

	public void setType(int type) {
		this.type = type;
	}
	
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	
	public void setUserId(int userId) {
		this.userId = userId;
	}	 

	@Override
	public String toString() {
		return "Parameter [name=" + name + ", type=" + type + ", in=" + in + ", out=" + out + ", typeName=" + typeName + ", userId=" + userId + "]";
	}
	
}
