package com.ott.server.controller;

import com.ott.server.entity.BLikes;
import com.ott.server.entity.Board;
import com.ott.server.entity.FileEntity;
import com.ott.server.entity.Member;
import com.ott.server.repository.BoardRepository;
import com.ott.server.service.BoardService;
import com.ott.server.service.S3UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/board")
public class BoardController {

    @Autowired
    BoardService bs;

    @GetMapping("/getBoardList/{page}")
    public HashMap<String, Object> getBoardList(
            @PathVariable("page") int page,
            @RequestParam(value = "searchWord", required = false, defaultValue = "") String searchWord,
            @RequestParam(value = "sortType", required = false, defaultValue = "latest") String sortType){
        HashMap<String, Object> result = bs.getBoardList(page, searchWord, sortType);
        return result;
    }

    @PostMapping("/writeForm")
    public HashMap<String, Object> writeForm(@RequestBody Board board){
        HashMap<String, Object> result = new HashMap<>();
        result.put("board", bs.insertBoard(board));
        return result;
    }

    @Autowired
    S3UploadService sus;

    @PostMapping("/upload")
    public HashMap<String, Object> fileUpload(@RequestParam("image") MultipartFile file) {
        HashMap<String , Object> result = new HashMap<>();
        try {
            int fidx = sus.saveFile(file);
            FileEntity fileEntity = sus.getFile(fidx);
            result.put("fidx", fileEntity.getFidx());
            result.put("image", sus.getFileUrl(fileEntity.getPath()));
            result.put("filename", fileEntity.getOriginalname());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @GetMapping("/getLikeList")
    public HashMap<String, Object> getLikeList(@RequestParam("boardid")int boardid){
        HashMap<String, Object> result = new HashMap<>();
        result.put("likeList", bs.getLikeList(boardid));
        return result;
    }

    @PostMapping("/addlike")
    public HashMap<String, Object> addLike(@RequestBody BLikes blikes){
        HashMap<String, Object> result = new HashMap<>();
        bs.addlike(blikes);
        result.put("msg","ok");
        System.out.println("blikes : " + blikes);
        return result;
    }

    @GetMapping("/getBoard/{bidx}")
    public HashMap<String, Object> getBoard(@PathVariable int bidx){
        HashMap<String, Object> result = new HashMap<>();
        Board board =  bs.getBoard(bidx);
        result.put("board", board);
        return result;
    }

    @PostMapping("/updateBoard")
    public HashMap<String, Object> updateBoard(@RequestBody Board board){
        HashMap<String, Object> result = new HashMap<>();
        bs.updateBoard(board);
        result.put("msg","ok");
        return result;
    }

    @DeleteMapping("/deleteBoard/{bidx}")
    public HashMap<String, Object> deleteBoard(@PathVariable int bidx){
        HashMap<String, Object> result = new HashMap<>();
        bs.deleteBoard(bidx);
        result.put("msg","ok");
        return result;
    }

//    @GetMapping("/getReplyList/{bidx}")
//    public HashMap<String, Object> getReplyList(@PathVariable("bidx")int bidx){
//        HashMap<String, Object> result = new HashMap<>();
//        result.put("replyList", bs.getReplyList(bidx));
//        System.out.println("댓글 리스트: " + bs.getReplyList(bidx));
//        return result;
//    }

    @PostMapping("/reportBoard/{bidx}")
    public HashMap<String, Object> reportBoard(
            @PathVariable("bidx")int bidx,
            @RequestBody Map<String, Integer> body){
        int midx = body.get("midx");
        HashMap<String, Object> result = new HashMap<>();
        try {
            bs.reportBoard(bidx,midx);
            result.put("msg","ok");
        } catch (RuntimeException e) {
            // 이미 신고한 경우에도 에러가 아닌 메시지로 처리
            // axios에서  catch가 아닌 then으로감
            result.put("msg", e.getMessage()); 
        } catch (Exception e){
            e.printStackTrace();
            result.put("msg", "fail");
        }
        return result;
    }

    @GetMapping("/isReported/{bidx}")
    public Map<String, Object> isReported(
            @PathVariable int bidx,
            @RequestParam int midx) {
        boolean reported = bs.isReported(bidx, midx);

        Map<String, Object> result = new HashMap<>();
        result.put("reported", reported);
        return result;
    }

}
