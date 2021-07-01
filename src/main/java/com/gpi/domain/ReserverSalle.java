package com.gpi.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ReserverSalle.
 */
@Entity
@Table(name = "reserver_salle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ReserverSalle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_reservation", nullable = false)
    private Instant dateReservation;

    @NotNull
    @Column(name = "motif", nullable = false)
    private String motif;

    @ManyToOne
    private Classe classe;

    @ManyToOne
    private Salle salle;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReserverSalle id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDateReservation() {
        return this.dateReservation;
    }

    public ReserverSalle dateReservation(Instant dateReservation) {
        this.dateReservation = dateReservation;
        return this;
    }

    public void setDateReservation(Instant dateReservation) {
        this.dateReservation = dateReservation;
    }

    public String getMotif() {
        return this.motif;
    }

    public ReserverSalle motif(String motif) {
        this.motif = motif;
        return this;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public ReserverSalle classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Salle getSalle() {
        return this.salle;
    }

    public ReserverSalle salle(Salle salle) {
        this.setSalle(salle);
        return this;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReserverSalle)) {
            return false;
        }
        return id != null && id.equals(((ReserverSalle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReserverSalle{" +
            "id=" + getId() +
            ", dateReservation='" + getDateReservation() + "'" +
            ", motif='" + getMotif() + "'" +
            "}";
    }
}
