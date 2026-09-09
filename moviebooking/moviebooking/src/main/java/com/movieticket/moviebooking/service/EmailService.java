package com.movieticket.moviebooking.service;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.entity.Booking;
import com.movieticket.moviebooking.entity.Ticket;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger =
            Logger.getLogger(EmailService.class.getName());

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /*
     * Sends the booking confirmation email. Only called after
     * a ticket has actually been created for a successful,
     * confirmed booking (see TicketService.createTicket).
     *
     * Any failure here is caught and logged - it must never
     * roll back or otherwise affect an already-successful
     * booking/ticket.
     */
    public void sendBookingConfirmation(
            Booking booking,
            Ticket ticket,
            List<String> seatNumbers) {

        if (fromAddress == null || fromAddress.isBlank()) {

            logger.warning(
                    "Email not configured (MAIL_USERNAME/" +
                    "MAIL_PASSWORD not set) - skipping " +
                    "booking confirmation email for booking #" +
                    booking.getId());

            return;
        }

        String toAddress = booking.getUser().getEmail();

        if (toAddress == null || toAddress.isBlank()) {

            logger.warning(
                    "User has no email on file - skipping " +
                    "confirmation email for booking #" +
                    booking.getId());

            return;
        }

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setFrom(fromAddress);
            helper.setTo(toAddress);
            helper.setSubject(
                    "🎬 Your Movie Ticket is Confirmed!");

            helper.setText(
                    buildEmailBody(booking, ticket, seatNumbers),
                    true);

            mailSender.send(message);

            logger.info(
                    "Booking confirmation email sent for " +
                    "booking #" + booking.getId());

        } catch (Exception e) {

            // Never let an email failure affect a successful
            // booking - just log it.
            logger.log(
                    Level.SEVERE,
                    "Failed to send confirmation email for " +
                    "booking #" + booking.getId() +
                    ": " + e.getMessage(),
                    e);
        }
    }

    private String buildEmailBody(
            Booking booking,
            Ticket ticket,
            List<String> seatNumbers) {

        String movieName =
                booking.getShow().getMovie().getTitle();

        String theatreName =
                booking.getShow().getTheatre().getName();

        String screenName =
                booking.getShow().getScreen().getName();

        String showDate = booking.getShow().getShowDate();
        String showTime = booking.getShow().getShowTime();

        String seatsText = String.join(", ", seatNumbers);

        String userName = booking.getUser().getName();

        return "<div style=\"font-family:'Segoe UI',Arial," +
                "sans-serif;max-width:520px;margin:auto;" +
                "background:#f5f7fb;padding:24px;\">" +

                "<div style=\"background:#ffffff;border-radius:16px;" +
                "overflow:hidden;box-shadow:0 4px 20px " +
                "rgba(31,41,55,0.08);\">" +

                "<div style=\"background:linear-gradient(135deg," +
                "#e91e63,#c2185b);padding:28px 24px;text-align:" +
                "center;\">" +
                "<h1 style=\"color:#ffffff;margin:0;font-size:22px;\">" +
                "🎬 Booking Confirmed!</h1>" +
                "</div>" +

                "<div style=\"padding:26px 24px;color:#1f2937;\">" +

                "<p style=\"font-size:15px;\">Hello <b>" + userName +
                "</b>,</p>" +

                "<p style=\"font-size:15px;line-height:1.6;\">" +
                "Your movie plans are officially on! 🎉 Your ticket " +
                "has been successfully booked. Sit back, relax, " +
                "grab your popcorn, and enjoy the show! 🍿🎬</p>" +

                "<div style=\"background:#f5f7fb;border-radius:12px;" +
                "padding:18px 20px;margin:20px 0;\">" +

                "<table style=\"width:100%;font-size:14px;" +
                "border-collapse:collapse;\">" +
                emailRow("Movie", movieName) +
                emailRow("Theatre", theatreName) +
                emailRow("Screen", screenName) +
                emailRow("Date", showDate) +
                emailRow("Time", showTime) +
                emailRow("Seats", seatsText) +
                emailRow("Booking ID", "#" + booking.getId()) +
                emailRow("Ticket ID", ticket.getTicketNumber()) +
                emailRow("Total Amount",
                        "₹" + booking.getTotalAmount()) +
                emailRow("Payment Status", "CONFIRMED") +
                "</table>" +

                "</div>" +

                "<p style=\"font-size:14px;color:#6b7280;\">" +
                "Thank you for booking with us. We hope you have " +
                "an amazing movie experience! 🍿❤️</p>" +

                "</div>" +

                "</div>" +

                "</div>";
    }

    private String emailRow(String label, String value) {

        return "<tr>" +
                "<td style=\"padding:6px 0;color:#6b7280;\">" +
                label + "</td>" +
                "<td style=\"padding:6px 0;text-align:right;" +
                "font-weight:600;color:#1f2937;\">" +
                value + "</td>" +
                "</tr>";
    }
}
