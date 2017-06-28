package com.atrioseguros.user.domain.model;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Random;

import org.junit.Before;
import org.junit.Test;

public class UserTest {
	private User user;

	@Before
	public void setUp() {
		this.user = new User(1, "username", "username@domain.com", "Username", "password", "ABCDEFG");
	}

	@Test
	public void testIsUserInRole() {
		assertNotNull(user);

		this.user.addRole("Role1");
		assertTrue(this.user.isUserInRole("ROLE1"));
		assertFalse(this.user.isUserInRole("ROLE2"));
	}

	@Test
	public void testToken() {
		String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		Random rnd = new Random();
		int len = 8;

		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++) {
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		}
		System.out.println(sb.toString());

	}

}
