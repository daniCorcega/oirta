package com.atrioseguros.infrastructure.persistence;

import java.sql.SQLData;
import java.sql.SQLException;
import java.sql.SQLInput;
import java.sql.SQLOutput;
import java.util.Map;

public class SQLStructValue implements SQLData {
	
	String sqlTypeName = null;	
	Map<String, Object> attributes;

	public SQLStructValue(String sqlTypeName, Map<String, Object> attributes) {
		super();
		this.sqlTypeName = sqlTypeName;
		this.attributes = attributes;
	}

	@Override
	public String getSQLTypeName() throws SQLException {
		return this.sqlTypeName;
	}

	@Override
	public void readSQL(SQLInput arg0, String arg1) throws SQLException {
		// TODO Auto-generated method stub
	}

	@Override
	public void writeSQL(SQLOutput sqlOutput) throws SQLException {
		// TODO Auto-generated method stub
	}

}
