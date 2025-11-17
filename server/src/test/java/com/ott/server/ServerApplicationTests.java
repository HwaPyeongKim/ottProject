package com.ott.server;

import com.ott.server.entity.Board;
import com.ott.server.repository.BoardRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
