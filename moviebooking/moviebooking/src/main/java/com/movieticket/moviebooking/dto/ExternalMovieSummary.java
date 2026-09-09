package com.movieticket.moviebooking.dto;

public class ExternalMovieSummary {

    private String imdbId;
    private String title;
    private String year;
    private String poster;
    private String type;

    public ExternalMovieSummary() {
    }

    public ExternalMovieSummary(String imdbId, String title,
            String year, String poster, String type) {

        this.imdbId = imdbId;
        this.title = title;
        this.year = year;
        this.poster = poster;
        this.type = type;
    }

    public String getImdbId() {
        return imdbId;
    }

    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
