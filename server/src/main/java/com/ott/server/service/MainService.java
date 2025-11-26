package com.ott.server.service;

import com.ott.server.entity.DbList;
import com.ott.server.entity.Likes;
import com.ott.server.entity.ListEntity;
import com.ott.server.repository.DbListRepository;
import com.ott.server.repository.LikesRepository;
import com.ott.server.repository.ListEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MainService {

    private final LikesRepository lr;
    private final DbListRepository dr;
    private final ListEntityRepository ler;

    public HashMap<String, Object> getLikes(int midx, int dbidx, int season) {
        HashMap<String, Object> result = new HashMap<>();
        int count = lr.countByDbidxAndSeason(dbidx, season);
        Likes likes = lr.findByMidxAndDbidxAndSeason(midx, dbidx, season);
        result.put("count", count);
        result.put("likes", likes);
        return result;
    }

    public HashMap<String, Object> like(Likes likes) {
        HashMap<String, Object> result = new HashMap<>();
        Likes likesData = lr.findByMidxAndDbidxAndSeason(likes.getMidx(), likes.getDbidx(), likes.getSeason());
        if (likesData != null) {
            lr.delete(likesData);
        } else {
            likesData = new Likes();
            likesData.setMidx(likes.getMidx());
            likesData.setDbidx(likes.getDbidx());
            likesData.setSeason(likes.getSeason());
            lr.save(likesData);
        }
        return result;
    }

    public List<Likes> getMyLikes(int midx) {
        List<Likes> result = lr.findAllByMidx(midx);
        return result;
    }

    public void addLists(int listidx, int dbidx, String posterpath, String title) {
        DbList dblist = dr.findByListidxAndDbidx(listidx, dbidx);
        if (dblist == null) {
            DbList dblistData = new DbList();
            dblistData.setListidx(listidx);
            dblistData.setDbidx(dbidx);
            dblistData.setPosterpath(posterpath);
            dblistData.setTitle(title);
            dr.save(dblistData);
        }
    }

    public List<DbList> getMyDblists(int midx) {
        List<DbList> dblist = new ArrayList<>();
        List<ListEntity> lists = ler.findAllByMidx(midx);
        if (lists != null) {
            for (ListEntity list : lists) {
                int listidx = list.getListidx();
                List<DbList> dbLists = dr.findAllByListidx(listidx, Sort.by(Sort.Direction.DESC, "id"));
                for (DbList dbList : dbLists) {
                    dblist.add(dbList);
                }
            }
        }
        return dblist;
    }

    public void addList(ListEntity list) {
        ler.save(list);
    }
}
