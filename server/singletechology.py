class SingleTechnology():
    def __init__(self, name, general_ability, general_effect, resource_ability,
                 unlocks_buildings, unlocks_units, image_path,
                 is_prerequisite_for):
        self.name = name
        self.general_ability = general_ability
        self.general_effect = general_effect
        self.has_prerequisites = {}
        self.image_path = image_path
        self.unlocks_buildings = unlocks_buildings
        self.unlocks_units = unlocks_units
        self.resource_ability = resource_ability
        self.is_prerequisite_for = {child.strip(): child.strip() for child in
                                    is_prerequisite_for.split(',') if
                                    is_prerequisite_for}

    def __str__(self):
        hor_sep = '_' * 30
        return '{hor_sep}\n{name}\n\t{description}\n{hor_sep}\nParents: {' \
               'parents}\nChildren: {children}\n' \
            .format(hor_sep=hor_sep, name=self.name,
                    description=self.general_ability,
                    parents=self.has_prerequisites,
                    children=self.is_prerequisite_for)