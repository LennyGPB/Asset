## GET :

/assets : Récupérer tous les assets (avec les catégories, les tags)
/asset/:id : Récupérer un asset (avec l'utilisateur propriétaire, les images additionnelles)

/categories : Récupérer toutes les catégories
/tags : Récupérer tous les tags

/user/:id : Récupérer les informations d'un utilisateur (peut inclure ses assets mis en vente, ses achats).
/user/:id/assets : Récupérer les assets d’un utilisateur connecté (pour son tableau de bord)

## POST :

/createAsset : Créer un asset [condition: être connecté & avoir le rôle admin/seller]
/createCategorie : Créer une nouvelle catégorie [condition: être connecté & avoir le rôle admin]
/createTag : Créer une nouveau Tag et le lier à une catégorie [condition: être connecté & avoir le rôle admin]
/signup : Inscription utilisateur (pseudo, email, password)
/buyAsset : Permet d'acheter un asset [condition : être connecté].

## PUT :

/updateAsset : Mettre à jour un asset existant [condition: être connecté & avoir le rôle admin/seller].
/updateUser : Mettre à jour les informations d'un utilisateur (profil, mot de passe, etc.)
/updateCategorie : Mettre à jour une catégorie existante [condition: admin].
/updateTag : Mettre à jour un tag existant [condition: admin].

## DELETE :

/deleteAsset/:id : Supprimer un asset [condition: être connecté & avoir le rôle admin/seller]
/deleteCategorie : Supprimer une catégorie [condition : être connecté & avoir le rôle admin].
/deleteTag : Supprimer un tag [condition : être connecté & avoir le rôle admin].
/deleteUser: Supprimer un utilisateur (soft delete ou suppression complète) [condition : être admin].
