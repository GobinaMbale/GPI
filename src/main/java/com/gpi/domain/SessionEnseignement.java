package com.gpi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SessionEnseignement.
 */
@Entity
@Table(name = "session_enseignement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SessionEnseignement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private Instant dateDebut;

    @NotNull
    @Column(name = "date_fin", nullable = false)
    private Instant dateFin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "matiere", "enseignant" }, allowSetters = true)
    private Enseigner cours;

    @ManyToOne
    @JsonIgnoreProperties(value = { "classe", "salle" }, allowSetters = true)
    private ReserverSalle salleReserver;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SessionEnseignement id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public SessionEnseignement dateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public SessionEnseignement dateFin(Instant dateFin) {
        this.dateFin = dateFin;
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public Enseigner getCours() {
        return this.cours;
    }

    public SessionEnseignement cours(Enseigner enseigner) {
        this.setCours(enseigner);
        return this;
    }

    public void setCours(Enseigner enseigner) {
        this.cours = enseigner;
    }

    public ReserverSalle getSalleReserver() {
        return this.salleReserver;
    }

    public SessionEnseignement salleReserver(ReserverSalle reserverSalle) {
        this.setSalleReserver(reserverSalle);
        return this;
    }

    public void setSalleReserver(ReserverSalle reserverSalle) {
        this.salleReserver = reserverSalle;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SessionEnseignement)) {
            return false;
        }
        return id != null && id.equals(((SessionEnseignement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SessionEnseignement{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
