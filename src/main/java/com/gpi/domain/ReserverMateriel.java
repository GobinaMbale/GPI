package com.gpi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ReserverMateriel.
 */
@Entity
@Table(name = "reserver_materiel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReserverMateriel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_reservation")
    private Instant dateReservation;

    @Column(name = "date_retour")
    private Instant dateRetour;

    @ManyToOne
    @JsonIgnoreProperties(value = { "departement", "grade" }, allowSetters = true)
    private UserMgr auteur;

    @ManyToOne
    @JsonIgnoreProperties(value = { "type" }, allowSetters = true)
    private Materiel materiel;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReserverMateriel id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDateReservation() {
        return this.dateReservation;
    }

    public ReserverMateriel dateReservation(Instant dateReservation) {
        this.dateReservation = dateReservation;
        return this;
    }

    public void setDateReservation(Instant dateReservation) {
        this.dateReservation = dateReservation;
    }

    public Instant getDateRetour() {
        return this.dateRetour;
    }

    public ReserverMateriel dateRetour(Instant dateRetour) {
        this.dateRetour = dateRetour;
        return this;
    }

    public void setDateRetour(Instant dateRetour) {
        this.dateRetour = dateRetour;
    }

    public UserMgr getAuteur() {
        return this.auteur;
    }

    public ReserverMateriel auteur(UserMgr userMgr) {
        this.setAuteur(userMgr);
        return this;
    }

    public void setAuteur(UserMgr userMgr) {
        this.auteur = userMgr;
    }

    public Materiel getMateriel() {
        return this.materiel;
    }

    public ReserverMateriel materiel(Materiel materiel) {
        this.setMateriel(materiel);
        return this;
    }

    public void setMateriel(Materiel materiel) {
        this.materiel = materiel;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReserverMateriel)) {
            return false;
        }
        return id != null && id.equals(((ReserverMateriel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReserverMateriel{" +
            "id=" + getId() +
            ", dateReservation='" + getDateReservation() + "'" +
            ", dateRetour='" + getDateRetour() + "'" +
            "}";
    }
}
