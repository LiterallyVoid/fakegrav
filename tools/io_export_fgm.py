import bpy, time, struct, json, math, mathutils
from bpy.props import *

bl_info = {
    "name": "Export fake.grav map",
    "author": "literallyvoid",
    "blender": (2, 78, 0),
    "location": "File > Export > FGM",
    "description": "pls",
    "category": "Import-Export"
    }

class ExportFGM(bpy.types.Operator):
    bl_idname = "export.fgm"
    bl_label = "Export FGM"

    filepath = StringProperty(subtype = "FILE_PATH", name = "File Path", description = "Filepath for exporting", maxlen = 1024, default = "")

    def execute(self, context):

        def t(x, y = None):
            if y == None:
                y = x.y
                x = x.x
                return mathutils.Vector([x, -y])
            else:
                return (x, -y)

        data = []
        objects = []
        for i in range(20):
            objects.append([])
            for o in context.scene.objects:
                if o.layers[i]:
                    objects[-1].append(o)
        for layer in range(20):
            layerData = {"objects": []}
            for obj in objects[layer]:
                if obj.type == "MESH":
                    if "arc" in obj.name.lower():
                        matrix = obj.matrix_world
                        x, y = (matrix * mathutils.Vector([0, 0, 0]))[:2]
                        x2, y2 = (matrix * mathutils.Vector([1, 0, 0]))[:2]
                        x, y = t(x, y)
                        x2, y2 = t(x2, y2)
                        r = math.degrees(math.atan2(y2 - y, x - x2))

                        size = 0
                        for i in range(8):
                            for j in range(3):
                                size = max(size, obj.bound_box[i][j])

                        angles = []
                        for v in obj.data.vertices:
                            nang = math.degrees(math.atan2(t(v.co).y, t(v.co).x)) + r
                            for o in angles:
                                while nang < o - 180:
                                    nang += 360
                                while nang > o + 180:
                                    nang -= 360
                            angles.append(nang)
                        angles = list(sorted(angles))
                        layerData["objects"].append(["arc", t(obj.location).x, t(obj.location).y, size, angles[0] + 180, angles[-1] + 180])
                    else:
                        for e in obj.data.edges:
                            v1 = t(obj.matrix_world * obj.data.vertices[e.vertices[0]].co)
                            v2 = t(obj.matrix_world * obj.data.vertices[e.vertices[1]].co)
                            layerData["objects"].append(["line", v1.x, v1.y, v2.x, v2.y])
                elif obj.type == "CURVE":
                    mesh = obj.to_mesh(context.scene, True, "RENDER")
                    properties = {}
                    if "lava" in obj.name.lower():
                        properties = {"onTouch": "restartLevel"}
                    for e in mesh.edges:
                        v1 = t(obj.matrix_world * mesh.vertices[e.vertices[0]].co)
                        v2 = t(obj.matrix_world * mesh.vertices[e.vertices[1]].co)
                        layerData["objects"].append(["line", v1.x, v1.y, v2.x, v2.y, properties])
                    bpy.data.meshes.remove(mesh)
                elif obj.type == "EMPTY":
                    if "spawn" in obj.name.lower():
                        matrix = obj.matrix_world
                        x, y = (matrix * mathutils.Vector([0, 0, 0]))[:2]
                        x2, y2 = (matrix * mathutils.Vector([1, 0, 0]))[:2]
                        x, y = t(x, y)
                        x2, y2 = t(x2, y2)
                        r = -math.degrees(math.atan2(y2 - y, x - x2)) + 180
                        layerData["objects"].append(["playerSpawn", x, y, r])
                    elif "portal" in obj.name.lower():
                        layerData["objects"].append(["portal", t(obj.location).x, t(obj.location).y])
                elif obj.type == "FONT":
                    matrix = obj.matrix_world
                    x, y = (matrix * mathutils.Vector([0, 0, 0]))[:2]
                    x2, y2 = (matrix * mathutils.Vector([1, 0, 0]))[:2]
                    x, y = t(x, y)
                    x2, y2 = t(x2, y2)
                    r = -math.degrees(math.atan2(x2 - x, y2 - y)) + 90
                    layerData["objects"].append(["text", obj.data.body, obj.data.size, t(obj.location).x, t(obj.location).y, r])
            if len(layerData["objects"]):
                data.append(layerData)
        fi = open(self.properties.filepath, "w")
        fi.write(json.dumps(data))
        fi.close()
      
        return {"FINISHED"}

    def invoke(self, context, event):
        wm = context.window_manager
        wm.fileselect_add(self)
        return {'RUNNING_MODAL'}

def menu_func(self, context):
    self.layout.operator(ExportFGM.bl_idname, text = "FGM", icon = "BLENDER")

def register():
    bpy.utils.register_class(ExportFGM)
    bpy.types.INFO_MT_file_export.append(menu_func)

def unregister():
    bpy.utils.unregister_class(ExportFGM)
    bpy.types.INFO_MT_file_export.remove(menu_func)

if __name__ ==  "__main__":
    register()
