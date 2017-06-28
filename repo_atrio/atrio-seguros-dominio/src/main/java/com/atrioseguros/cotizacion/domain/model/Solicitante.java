/*
 * Solicitante.java dannyds
 *
 * Copyright (c) 2014 CLETECI, C.A. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * CLETECI, C.A. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with CLETECI.
 *
 * CLETECI MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
 * THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. SUN SHALL NOT BE LIABLE FOR
 * ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
 * DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */
package com.atrioseguros.cotizacion.domain.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author dannyds
 *
 */
public class Solicitante {

	protected String tipoId;
	protected String numId;
	protected String nombre;
	protected String apellidos;
	protected String sexo;
	protected Date fechaNacimiento;
	protected String estado;
	protected String direccion;
	protected String email;
	List<Telefono> telefonos;

	public Solicitante(String tipoId, String numId, String nombre, String apellidos, String sexo, Date fechaNacimiento, String estado, String direccion,
			String email) {
		this.setTipoId(tipoId);
		this.setNumId(numId);
		this.setNombre(nombre);
		this.setApellidos(apellidos);
		this.setSexo(sexo);
		this.setFechaNacimiento(fechaNacimiento);
		this.setEstado(estado);
		this.setDireccion(direccion);
	}

	public String getTipoId() {
		return tipoId;
	}

	public void setTipoId(String tipoId) {
		this.tipoId = tipoId;
	}

	public String getNumId() {
		return numId;
	}

	public void setNumId(String numId) {
		this.numId = numId;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getSexo() {
		return sexo;
	}

	public void setSexo(String sexo) {
		this.sexo = sexo;
	}

	public Date getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(Date fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Telefono> getTelefonos() {
		return telefonos;
	}

	public void addTelefono(Telefono telefono) {
		if (this.telefonos == null) {
			this.telefonos = new ArrayList<Telefono>();
		}
		
		this.telefonos.add(telefono);
	}

}
