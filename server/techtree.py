import singletechology
import json
import pprint
import os
import inspect


class TechTree():
    def __init__(self, tree_name):
        self.techs = {}
        self.tech_tree_name = tree_name
        self.tech_file = '{}/static/{}.csv' \
            .format(os.path.dirname(
            os.path.abspath(inspect.getfile(
                inspect.currentframe()))), tree_name)
        self.gather_techs()

    def __str__(self):
        return pprint.pformat(self.build_dictionary())

    def gather_techs(self):
        try:
            with open(self.tech_file) as f:
                f.readline()
                for line in f.readlines():
                    my_tech = singletechology.SingleTechnology(
                        *line.strip().decode().split(';'))
                    self.techs[my_tech.name] = my_tech
            self.connect_tech_genealogies()
        except IOError:
            self.techs = {}

    def connect_tech_genealogies(self):
        for my_tech in self.techs.values():
            if my_tech.is_prerequisite_for:
                for k, v in my_tech.is_prerequisite_for.iteritems():
                    k = k.strip()
                    self.techs[k].has_prerequisites[
                        my_tech.name.strip()] = my_tech
            if my_tech.has_prerequisites:
                for k, v in my_tech.has_prerequisites.iteritems():
                    k.strip()
                    self.techs[k].is_prerequisite_for[
                        my_tech.name.strip()] = my_tech

    def print_stuff_with_instances(self):
        for k, v in self.techs.iteritems():
            for val in v.has_prerequisites.values():
                print 'Parents:\n{}'.format(val)
            for val in v.is_prerequisite_fore.values():
                print 'Children:\n{}'.format(val)
            print '_' * 60

    def build_dictionary(self):
        my_tree = {"technologies": [
            {'name': my_tech.name,
             'general_ability': my_tech.general_ability,
             'general_effect': my_tech.general_effect,
             'resource_ability': my_tech.resource_ability,
             'unlocks_buildings': my_tech.unlocks_buildings,
             'unlocks_units': my_tech.unlocks_units,
             'image_path': my_tech.image_path,
             'has_prerequisites': my_tech.has_prerequisites.keys(),
             'is_prerequisite_for':
                 my_tech.is_prerequisite_for.keys()}
            for my_tech in self.techs.values() if
            self.techs], 'name': self.tech_tree_name, 'message': 'success'}
        if len(my_tree['technologies']) <= 0:
            my_tree['message'] = 'error'
        return my_tree

    def jsonify(self):
        return json.dumps(self.build_dictionary()).replace('"', '\\"')


if __name__ == '__main__':
    TechTree()
