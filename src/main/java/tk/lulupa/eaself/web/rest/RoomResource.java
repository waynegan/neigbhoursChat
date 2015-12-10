package tk.lulupa.eaself.web.rest;

import com.codahale.metrics.annotation.Timed;
import tk.lulupa.eaself.domain.Room;
import tk.lulupa.eaself.repository.RoomRepository;
import tk.lulupa.eaself.repository.search.RoomSearchRepository;
import tk.lulupa.eaself.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Room.
 */
@RestController
@RequestMapping("/api")
public class RoomResource {

    private final Logger log = LoggerFactory.getLogger(RoomResource.class);

    @Inject
    private RoomRepository roomRepository;

    @Inject
    private RoomSearchRepository roomSearchRepository;

    /**
     * POST  /rooms -> Create a new room.
     */
    @RequestMapping(value = "/rooms",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Room> createRoom(@RequestBody Room room) throws URISyntaxException {
        log.debug("REST request to save Room : {}", room);
        if (room.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new room cannot already have an ID").body(null);
        }
        Room result = roomRepository.save(room);
        roomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/rooms/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert("room", result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /rooms -> Updates an existing room.
     */
    @RequestMapping(value = "/rooms",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Room> updateRoom(@RequestBody Room room) throws URISyntaxException {
        log.debug("REST request to update Room : {}", room);
        if (room.getId() == null) {
            return createRoom(room);
        }
        Room result = roomRepository.save(room);
        roomSearchRepository.save(room);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert("room", room.getId().toString()))
                .body(result);
    }

    /**
     * GET  /rooms -> get all the rooms.
     */
    @RequestMapping(value = "/rooms",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Room> getAllRooms() {
        log.debug("REST request to get all Rooms");
        return roomRepository.findAll();
    }

    /**
     * GET  /rooms/:id -> get the "id" room.
     */
    @RequestMapping(value = "/rooms/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        log.debug("REST request to get Room : {}", id);
        return Optional.ofNullable(roomRepository.findOne(id))
            .map(room -> new ResponseEntity<>(
                room,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /rooms/:id -> delete the "id" room.
     */
    @RequestMapping(value = "/rooms/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        log.debug("REST request to delete Room : {}", id);
        roomRepository.delete(id);
        roomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("room", id.toString())).build();
    }

    /**
     * SEARCH  /_search/rooms/:query -> search for the room corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/rooms/{query}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Room> searchRooms(@PathVariable String query) {
        return StreamSupport
            .stream(roomSearchRepository.search(queryString(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
