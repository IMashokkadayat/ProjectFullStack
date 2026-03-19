package net.engineeringdigest.journalApp.service;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.Repository.JournalEntryRepository;
import net.engineeringdigest.journalApp.entity.JournalEntry;
import net.engineeringdigest.journalApp.entity.User;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class JournalEntryService {
    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @Autowired
    private UserService userService;



    @Transactional
    public void saveEntry(JournalEntry journalEntry, String userName) {

      try{
          journalEntry.setDate(LocalDateTime.now());
          User user = userService.findByUsername(userName);
          JournalEntry saved = journalEntryRepository.save(journalEntry);

          user.getJournalentries().add(saved);
          userService.saveUser(user);
      }catch(Exception e){
          System.out.println(e);
          throw new RuntimeException("An error occurred while saving entry",e );
      }
    }
    public void saveEntry(JournalEntry journalEntry) {

        journalEntryRepository.save(journalEntry);
    }

    public List<JournalEntry> getAll(){
        return journalEntryRepository.findAll();
    }

    public Optional< JournalEntry> findById(ObjectId id) {
        return journalEntryRepository.findById(id);
    }

    @Transactional
    public boolean deleteById(ObjectId id, String userName) {
        boolean remove = false;
       try {
           User user = userService.findByUsername(userName);
           remove = user.getJournalentries().removeIf(j -> j.getId().equals(id));
           if(remove){
               userService.saveUser(user);
               journalEntryRepository.deleteById(id);
           }

       } catch (Exception e) {
           log.error("Error");
           throw new RuntimeException("An error occurred while deleting entry",e );
       }
       return remove;


    }


}
