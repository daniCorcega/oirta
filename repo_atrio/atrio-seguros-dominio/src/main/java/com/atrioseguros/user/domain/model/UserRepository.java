/**
 *
 */
package com.atrioseguros.user.domain.model;

/**
 * @author dannyds
 *
 */
public interface UserRepository {
	public void add(User aUser);
	public void remove(User aUser);
	public User findByUsername(String username);
	public User findByEmail(String email);
	public User findByToken(String token);
	public String getCodigoUsuario(String username);
	public String getCodigoIntermediario(String username);
	public void changePassword(String username, String newPassword);
	public String generateToken(User aUser);
	public void updateLastLoginDate(String username);

}
