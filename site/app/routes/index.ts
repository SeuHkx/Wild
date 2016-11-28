/**
 * Created by hkx on 2016/11/22.
 */
import * as Router from 'koa-router';
import action from './../controllers/'

const router = new Router();

router.get('/',action.index);



export default router;