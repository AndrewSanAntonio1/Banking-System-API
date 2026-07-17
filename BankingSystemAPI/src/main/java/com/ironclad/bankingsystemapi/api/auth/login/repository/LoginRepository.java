package com.ironclad.bankingsystemapi.api.auth.login.repository;

import com.ironclad.bankingsystemapi.api.auth.register.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
