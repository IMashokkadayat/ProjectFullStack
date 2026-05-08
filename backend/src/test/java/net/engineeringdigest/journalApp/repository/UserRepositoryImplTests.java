package net.engineeringdigest.journalApp.repository;


import com.mongodb.assertions.Assertions;
import net.engineeringdigest.journalApp.Repository.UserRepository;
import net.engineeringdigest.journalApp.Repository.UserRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserRepositoryImplTests {

    @Autowired
    private UserRepositoryImpl userRepositoryimpl;

    @Test
    public void testSaveNewUser(){
        Assertions.assertNotNull(userRepositoryimpl.getUserForSA());
    }
}
