import datetime

from pydantic import BaseModel
from sqlalchemy import DateTime



class ImageUploadAck(BaseModel):
    src:str

class DeleteAck(BaseModel):
    ack:str


class ImageBase(BaseModel):
    name:str=""
    url:str=""




class ImageCreate(ImageBase):
    pass


class ImageModify(ImageBase):
    img_content:str|None=None
    order:int|None=None


class ImageSimple(ImageModify):
    id:int




class Image(ImageBase):
    id:int
    item_id:int
    owner_id:str
    class Config:
        from_attributes=True

class ImageDetail(Image):
    img_content:str|None=None
    order:int|None=None



class ItemBase(BaseModel):
    title: str|None=None
    description: str | None = None
    src:str|None=None
    price:float|None=None
    vipPrice:float|None=None
    content: str | None = None



class ItemCreate(ItemBase):#创建数据是不知道id和owner_id的，所以不需要id和owner_id
    pass

class ItemModify(ItemBase):
    pass


class UserItem(BaseModel):
    name:str

class UserBase(UserItem):
    avatar: str | None = None



class Like(BaseModel):
    owner_id:str
    create_time:datetime.datetime
    class Config:
        from_attributes = True

class Item(ItemBase):
    id: int
    owner_id: str
    star: int=0
    modify_time:datetime.datetime
    create_time:datetime.datetime
    owner:UserBase
    comment_count:int=0
    likes: list[Like] = []
    class Config:
        from_attributes = True





class UserUpdate(UserBase):
    pass


class UserCreate(UserBase):#创建用户是不知道id和items的，所以不需要id和items
    pass


class User(UserBase):#读用户数据
    id: int
    uuid: str
    class Config:
        from_attributes = True
    # Pydantic's orm_mode will tell the Pydantic model to read the data even if it is not a dict,
    # but an ORM model (or any other arbitrary object with attributes). like
    # 　user.id


class CommentBase(BaseModel):
    content:str
    order:int
    hint:str
    url: str
    parent_id:int|None=None




class CommentCreate(CommentBase):
    pass


class CommentShow(CommentCreate):

    id:int
    create_time:datetime.datetime
    owner_id: str
    owner: UserBase
    class Config:
        from_attributes = True


class CommentDetail(CommentShow):
    item_id:int
    # item: ItemBase
    replies: list[CommentShow]=[]




class UserDetail(User):#读用户数据
    items: list[Item] = []
    comments:list[CommentShow]=[]
    class Config:
        from_attributes = True


class UserProfile(UserDetail):#读取“我的”页面的用户数据
    email:str
    class Config:
        from_attributes = True


class ItemDetail(Item):
    content: str|None=None
    images: list[ImageSimple] = []
    comments:list[CommentDetail]=[]
    class Config:
        from_attributes = True
        
class ReadLog(BaseModel):
    item_id:int
    owner_id:str
    create_time:datetime.datetime
    class Config:
        from_attributes = True

class Follow(BaseModel):
    follower_id:str
    followee_id:str
    create_time:datetime.datetime
    follower: UserBase
    followee: UserBase
class UserFollowDetail(User):
    followers: list[Follow] = []
    followees: list[Follow] = []
    class Config:
        from_attributes = True