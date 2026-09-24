# Réseau de Petri — Distributeur automatique de boisson avec réapprovisionnement automatique

## Hypothèses de modélisation

- Le distributeur ne vend **qu'un seul type de boisson**.
- Capacité maximale du distributeur : **5 boissons**.
- Seuil de réapprovisionnement : dès que le stock du distributeur tombe à **2 boissons ou moins** (c'est-à-dire qu'il y a au moins 3 emplacements vides), un cycle de réapprovisionnement se déclenche.
- Chaque réapprovisionnement transfère **3 boissons** depuis un entrepôt central vers le distributeur.
- Le mécanisme de réapprovisionnement ne peut traiter qu'un cycle à la fois (pas de réappro concurrent).

---

## 1. Description des places (P) et marquage initial

| Place | Description | Jetons initiaux (M0) |
|---|---|---|
| **P1 – Distributeur_Disponible** | Le distributeur est libre et prêt à accepter un nouveau client | **1** |
| **P2 – Pièce_Insérée** | Une pièce vient d'être insérée par le client, en attente de service | 0 |
| **P3 – Stock_Distributeur** | Nombre de boissons actuellement disponibles à la vente dans le distributeur | **5** |
| **P4 – Emplacement_Libre** | Nombre d'emplacements vides dans le compartiment du distributeur (complémentaire de P3 ; P3+P4 = 5 en permanence) | 0 |
| **P5 – Boisson_Servie** | Boissons effectivement délivrées au client (compteur de sorties) | 0 |
| **P6 – Réappro_Disponible** | Le mécanisme/chariot de réapprovisionnement est libre, non occupé | **1** |
| **P7 – Réappro_En_Cours** | Un cycle de réapprovisionnement (3 emplacements réservés) est en cours d'exécution | 0 |
| **P8 – Stock_Entrepôt** | Réserve centrale de boissons servant à réapprovisionner le distributeur | **50** |

---

## 2. Description des transitions (T)

| Transition | Places d'entrée (et poids) | Places de sortie (et poids) | Condition / description |
|---|---|---|---|
| **T1 – Insérer_Pièce** | P1 (1) | P2 (1) | Le client insère une pièce ; le distributeur passe de l'état "disponible" à l'état "pièce insérée". |
| **T2 – Distribuer_Boisson** | P2 (1), P3 (1) | P5 (1), P4 (1), P1 (1) | Si une pièce a été insérée **et** qu'il reste au moins une boisson en stock : la boisson est servie, un emplacement se libère, le distributeur redevient disponible pour le client suivant. |
| **T3 – Déclencher_Réapprovisionnement** | P4 (3), P6 (1) | P7 (1) | Dès qu'au moins 3 emplacements sont vides (stock bas) et que le mécanisme de réappro est libre : réservation de 3 emplacements et démarrage d'un cycle de réapprovisionnement. |
| **T4 – Terminer_Réapprovisionnement** | P7 (1), P8 (3) | P3 (3), P6 (1) | L'entrepôt fournit 3 boissons qui remplissent les emplacements réservés ; le stock du distributeur augmente de 3, et le mécanisme redevient disponible. |

---

## 3. Vérification de cohérence
- **Invariant de place** : P3 + P4 = 5 en permanence (capacité fixe du distributeur) → confirme que le modèle est borné.
- **Vivacité** : tant que P8 (stock entrepôt) n'est pas épuisé, le réseau reste vivant : vente et réapprovisionnement alternent indéfiniment.
- **Point de blocage potentiel** : si P8 s'épuise, T4 ne peut plus se franchir, ce qui finira par bloquer T2 une fois P3 à 0 — comportement réaliste (rupture de stock entrepôt).
