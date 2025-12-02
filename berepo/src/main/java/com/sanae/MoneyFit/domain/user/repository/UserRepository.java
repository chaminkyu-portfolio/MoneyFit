package com.sanae.MoneyFit.domain.user.repository;
import com.sanae.MoneyFit.domain.user.entity.User;
import com.sanae.MoneyFit.domain.user.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
//  Optional<User> findById(String username);

  boolean existsByEmail(String username);
  boolean existsByNickname(String nickname);

  Optional<User> findByEmail(String email);

}