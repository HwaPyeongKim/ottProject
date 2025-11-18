package com.ott.server;

import com.ott.server.entity.Board;
import com.ott.server.entity.BoardStatus;
import com.ott.server.repository.BoardRepository;
import com.ott.server.service.BoardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class ServerApplicationTests {

    @Test
    void contextLoads() {
        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        System.out.println("encoding password : " + pe.encode("1234"));
    }

//    @Autowired
//    private BoardRepository boardRepository;
//
//    @Test
//    public void testSort() {
//        Pageable pageable = PageRequest.of(0, 10,
//                Sort.by(Sort.Direction.DESC, "likecount")
//                        .and(Sort.by(Sort.Direction.DESC, "writedate")));
//
//        Page<Board> page = boardRepository.findAll(pageable);
//
//        page.getContent().forEach(b -> {
//            System.out.println(b.getBidx() + " / like: " + b.getLikecount() + " / date: " + b.getWritedate());
//        });
//    }
}
