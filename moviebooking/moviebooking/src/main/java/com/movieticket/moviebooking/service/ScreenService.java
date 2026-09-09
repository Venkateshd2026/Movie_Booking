package com.movieticket.moviebooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.entity.Screen;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.repository.ScreenRepository;
import com.movieticket.moviebooking.repository.SeatRepository;

@Service
public class ScreenService {

    private static final int TOTAL_ROWS = 10;
    private static final int SEATS_PER_ROW = 10;
    private static final double DEFAULT_SEAT_PRICE = 150.0;
    private static final String DEFAULT_SEAT_TYPE = "REGULAR";

    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;

    public ScreenService(
            ScreenRepository screenRepository,
            SeatRepository seatRepository) {

        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
    }

    public Screen saveScreen(Screen screen) {

        // Seat layout is now fixed at 10 x 10 = 100 seats,
        // so the screen's totalSeats always reflects that.
        screen.setTotalSeats(TOTAL_ROWS * SEATS_PER_ROW);

        Screen savedScreen = screenRepository.save(screen);

        generateSeatsIfMissing(savedScreen);

        return savedScreen;
    }

    /*
     * Automatically creates 100 seats (10 rows x 10 seats,
     * numbered 1-100 sequentially) for a newly created screen.
     *
     * Guarded so it never runs twice for the same screen -
     * if seats already exist for this screen (e.g. the
     * screen-creation request was retried), nothing happens.
     */
    private void generateSeatsIfMissing(Screen screen) {

        List<Seat> existingSeats =
                seatRepository.findByScreenId(screen.getId());

        if (!existingSeats.isEmpty()) {

            return;
        }

        List<Seat> newSeats = new ArrayList<>();

        int seatNumber = 1;

        for (int row = 1; row <= TOTAL_ROWS; row++) {

            for (int col = 1; col <= SEATS_PER_ROW; col++) {

                newSeats.add(new Seat(
                        String.valueOf(seatNumber),
                        DEFAULT_SEAT_TYPE,
                        DEFAULT_SEAT_PRICE,
                        screen
                ));

                seatNumber++;
            }
        }

        seatRepository.saveAll(newSeats);
    }

    public List<Screen> getAllScreens() {
        return screenRepository.findAll();
    }

    public Screen getScreenById(Long id) {
        return screenRepository.findById(id).orElse(null);
    }

    public void deleteScreen(Long id) {
        screenRepository.deleteById(id);
    }
}