package com.movieticket.moviebooking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String genre;

    @Column(nullable = false)
    private Integer duration;

    private String releaseDate;

    private String posterUrl;

    // External movie API reference (OMDb imdbID).
    // Nullable so existing/manually-added movies are unaffected.
    @Column(unique = true)
    private String imdbId;

    public Movie() {
    }

    public Movie(String title, String description, String language,
                 String genre, Integer duration, String releaseDate,
                 String posterUrl) {

        this.title = title;
        this.description = description;
        this.language = language;
        this.genre = genre;
        this.duration = duration;
        this.releaseDate = releaseDate;
        this.posterUrl = posterUrl;
    }

    public String getImdbId() {

        return imdbId;
    }

    public void setImdbId(String imdbId) {

        this.imdbId = imdbId;
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getTitle() {

        return title;
    }

    public void setTitle(String title) {

        this.title = title;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public String getLanguage() {

        return language;
    }

    public void setLanguage(String language) {

        this.language = language;
    }

    public String getGenre() {

        return genre;
    }

    public void setGenre(String genre) {

        this.genre = genre;
    }

    public Integer getDuration() {

        return duration;
    }

    public void setDuration(Integer duration) {

        this.duration = duration;
    }

    public String getReleaseDate() {

        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {

        this.releaseDate = releaseDate;
    }

    public String getPosterUrl() {

        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {

        this.posterUrl = posterUrl;
    }
}