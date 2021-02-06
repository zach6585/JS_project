class Painting < ApplicationRecord
    belongs_to :user
    class NewSerializer
        def self.load(value)
          return {} if !value #### THIS NEW LINE
          obj = YAML.load(value)
          if obj.respond_to?(:to_unsafe_h)
            obj.to_unsafe_h
          else
            obj
          end
        end
        def self.dump(value)
          if value.respond_to?(:to_unsafe_h)
            YAML.dump(value.to_unsafe_h)
          else
            YAML.dump(value)
          end
        end
      end
      
    serialize :color_data, NewSerializer
end
