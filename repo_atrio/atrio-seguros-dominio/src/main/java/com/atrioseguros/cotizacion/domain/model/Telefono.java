package com.atrioseguros.cotizacion.domain.model;

public class Telefono {
	private String codigo;
	private String numero;

	public Telefono(String codigo, String numero) {
		this.setCodigo(codigo);
		this.setNumero(numero);
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

}
